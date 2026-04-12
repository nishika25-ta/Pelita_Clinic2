import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type MotionValue } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Megaphone, Newspaper, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "../../contexts/I18nContext";
import { CLINIC_INFO } from "../../config/clinicData";
import { HERO_HIGHLIGHTS, HERO_POSTERS, type HeroHighlightId } from "../../config/heroSectionContent";
import "./HeroSection.css";

interface HeroSectionProps {
  yHero: MotionValue<string>;
  splashReveal?: boolean;
}

const easeIn = [0.42, 0, 1, 1] as const;

const blockReveal = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeIn },
  },
};

/** Served from `public/hero.mp4` → `/hero.mp4`. Single instance — only visible on the first slide. */
const HERO_VIDEO_SRC = "/hero.mp4";

const HIGHLIGHT_ICONS: Record<HeroHighlightId, typeof Megaphone> = {
  promotions: Megaphone,
  news: Newspaper,
  hiring: UserPlus,
};

const HIGHLIGHT_BG: Record<HeroHighlightId, string> = {
  promotions: "bg-gradient-to-br from-violet-950 via-purple-950 to-black",
  news: "bg-gradient-to-br from-slate-900 via-violet-950/95 to-black",
  hiring: "bg-gradient-to-br from-teal-950/90 via-slate-950 to-black",
};

type HeroSlide =
  | { kind: "main" }
  | { kind: "poster"; posterId: string; src: string; alt: string }
  | { kind: "highlight"; id: HeroHighlightId; category: string; title: string; description: string };

function HighlightIconBadge({ id }: { id: HeroHighlightId }) {
  const Icon = HIGHLIGHT_ICONS[id];
  return (
    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md">
      <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden />
    </div>
  );
}

export default function HeroSection({ yHero, splashReveal }: HeroSectionProps) {
  const { t, getHeroHighlight } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.08 });
  const reduceMotion = useReducedMotion();
  const heroReady = splashReveal === undefined ? isInView : splashReveal;

  const slides = useMemo<HeroSlide[]>(
    () => [
      { kind: "main" },
      ...HERO_POSTERS.map((p) => ({
        kind: "poster" as const,
        posterId: p.id,
        src: p.src,
        alt: t(`hero.posters.${p.id}.alt`),
      })),
      ...HERO_HIGHLIGHTS.map((h) => ({ kind: "highlight" as const, ...getHeroHighlight(h.id) })),
    ],
    [t, getHeroHighlight],
  );
  const slideCount = slides.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (delta: number) => {
      setActiveIndex((i) => (i + delta + slideCount) % slideCount);
    },
    [slideCount],
  );

  useEffect(() => {
    const el = heroVideoRef.current;
    if (!el || !heroReady) return;
    if (activeIndex === 0) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [heroReady, activeIndex]);

  useEffect(() => {
    if (reduceMotion || autoPaused) {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
      return;
    }
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % slideCount);
    }, 7500);
    return () => {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [reduceMotion, autoPaused, slideCount, activeIndex]);

  const showVideo = activeIndex === 0;
  const transitionMs = reduceMotion ? 0 : 520;

  const liveCaption = useMemo(() => {
    const s = slides[activeIndex];
    if (!s) return "";
    if (s.kind === "main") return t("hero.liveMain");
    if (s.kind === "poster") return s.alt;
    return `${s.category}. ${s.title}`;
  }, [slides, activeIndex, t]);

  return (
    <section
      ref={sectionRef}
      id="home"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("hero.carouselAria")}
      className="hero-section relative isolate flex min-h-[100dvh] min-h-[100svh] flex-col overflow-hidden text-white [font-family:var(--font-apple)] antialiased"
      style={{ WebkitFontSmoothing: "antialiased" }}
      onMouseEnter={() => setAutoPaused(true)}
      onMouseLeave={() => setAutoPaused(false)}
    >
      {/* Single hero video + overlay — only the first slide reveals it (no duplicate video). */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <motion.div
          className="hero-parallax-layer absolute inset-[0_-5%] top-[-8%] h-[116%] w-[110%] max-w-none"
          style={
            reduceMotion || !showVideo
              ? undefined
              : {
                  y: yHero,
                }
          }
        >
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              ref={heroVideoRef}
              className="hero-bg-video absolute inset-0 z-0 h-full w-full object-cover object-center transition-opacity duration-500"
              style={{ opacity: showVideo ? 1 : 0 }}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/poster1.jpeg"
              disablePictureInPicture
              aria-hidden
            >
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          </div>
          <div
            className="absolute inset-0 z-[1] bg-gradient-to-b from-black/55 via-black/45 to-black/60 transition-opacity duration-500"
            style={{ opacity: showVideo ? 1 : 0 }}
          />
        </motion.div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {t("hero.srLine", {
              current: String(activeIndex + 1),
              total: String(slideCount),
              caption: liveCaption,
            })}
          </p>
          <div
            className="flex h-full will-change-transform"
            style={{
              width: `${slideCount * 100}%`,
              transform: `translateX(-${(100 / slideCount) * activeIndex}%)`,
              transition: reduceMotion ? "none" : `transform ${transitionMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          >
            {slides.map((slide) => (
              <div
                key={slide.kind === "main" ? "main" : slide.kind === "poster" ? slide.posterId : slide.id}
                className={cn(
                  "relative min-h-[100dvh] min-h-[100svh] shrink-0 overflow-hidden",
                  slide.kind === "poster"
                    ? "p-0"
                    : "flex flex-col items-center justify-center px-6 pb-20 pt-[calc(5rem+env(safe-area-inset-top,0px))] sm:px-10 sm:pb-24 sm:pt-[calc(5.5rem+env(safe-area-inset-top,0px))]",
                )}
                style={{ width: `${100 / slideCount}%` }}
              >
                {slide.kind === "poster" ? (
                  <>
                    <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black" aria-hidden />
                    <div className="relative z-[1] flex min-h-[100dvh] min-h-[100svh] w-full items-center justify-center px-4 pb-24 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-28 sm:pt-[calc(5rem+env(safe-area-inset-top,0px))]">
                      <div className="hero-poster-frame w-full max-w-[min(100%,28rem)] sm:max-w-[min(100%,36rem)] md:max-w-[min(100%,42rem)]">
                        <img
                          src={slide.src}
                          alt={slide.alt}
                          className="hero-poster-img block w-full rounded-2xl border border-white/15 bg-black/30 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10 sm:rounded-3xl"
                          loading={slide.posterId === "poster-prep" ? "eager" : "lazy"}
                          decoding="async"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 36rem, 42rem"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {slide.kind === "highlight" && (
                      <div
                        className={`pointer-events-none absolute inset-0 z-0 ${HIGHLIGHT_BG[slide.id]}`}
                        aria-hidden
                      />
                    )}
                    <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                      {slide.kind === "main" ? (
                        <motion.div
                          variants={blockReveal}
                          initial="hidden"
                          animate={heroReady && activeIndex === 0 ? "visible" : "hidden"}
                          className="flex flex-col items-center"
                        >
                          <motion.h1
                            variants={fadeUp}
                            className="text-balance text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-6xl md:text-7xl lg:text-8xl"
                          >
                            <span className="block text-white">{t("hero.mainLine1")}</span>
                            <span className="mt-1 block text-[#D4C5A0] sm:mt-2">{t("hero.mainLine2")}</span>
                          </motion.h1>

                          <motion.p
                            variants={fadeUp}
                            className="mt-8 max-w-2xl text-pretty text-base font-normal leading-relaxed text-white/90 sm:mt-10 sm:text-lg"
                          >
                            {t("hero.intro", { name: CLINIC_INFO.name })}
                          </motion.p>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <HighlightIconBadge id={slide.id} />
                          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{slide.category}</p>
                          <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                            {slide.title}
                          </h2>
                          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
                            {slide.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-2 sm:px-4">
            <button
              type="button"
              onClick={() => go(-1)}
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white shadow-lg backdrop-blur-md transition hover:border-white/45 hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              aria-label={t("hero.prev")}
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white shadow-lg backdrop-blur-md transition hover:border-white/45 hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              aria-label={t("hero.next")}
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))]">
        <motion.a
          href="#services"
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/80 shadow-lg backdrop-blur-md transition hover:border-white/40 hover:bg-white/15 hover:text-white"
          aria-label={t("hero.scrollServices")}
          initial={{ opacity: 0, y: 8 }}
          animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.9, duration: 0.55, ease: easeIn }}
        >
          <motion.span
            animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
            transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex"
          >
            <ChevronDown className="h-5 w-5" aria-hidden />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
