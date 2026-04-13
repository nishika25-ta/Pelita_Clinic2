import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
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

/** Hero slide strip — horizontal pan; `translate3d` keeps it on the GPU (smoother on mobile). */
const HERO_CAROUSEL_MS = 840;
const HERO_CAROUSEL_EASE = "cubic-bezier(0.33, 1, 0.68, 1)";

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
  | { kind: "poster"; posterId: string; src: string; srcMobile?: string; alt: string }
  | { kind: "highlight"; id: HeroHighlightId; category: string; title: string; description: string };

function HighlightIconBadge({ id }: { id: HeroHighlightId }) {
  const Icon = HIGHLIGHT_ICONS[id];
  return (
    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-lg md:backdrop-blur-md">
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
        srcMobile: p.srcMobile,
        alt: t(`hero.posters.${p.id}.alt`),
      })),
      ...HERO_HIGHLIGHTS.map((h) => ({ kind: "highlight" as const, ...getHeroHighlight(h.id) })),
    ],
    [t, getHeroHighlight],
  );
  const slideCount = slides.length;
  const slideCountRef = useRef(slideCount);
  slideCountRef.current = slideCount;

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches,
  );
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragStartClientXRef = useRef(0);
  const velocityRef = useRef({ x: 0, t: 0 });
  const dragAbortRef = useRef<AbortController | null>(null);

  activeIndexRef.current = activeIndex;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(
    () => () => {
      dragAbortRef.current?.abort();
      dragAbortRef.current = null;
    },
    [],
  );

  const go = useCallback(
    (delta: number) => {
      setDragPx(0);
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

  /** Advance every 5s once the hero is interactable (after splash when `splashReveal` is used).
   *  Pauses while the user is dragging on desktop. */
  useEffect(() => {
    if (!heroReady || isDragging) {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
      return;
    }
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    autoTimerRef.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slideCountRef.current);
    }, 5000);
    return () => {
      if (autoTimerRef.current) {
        clearInterval(autoTimerRef.current);
        autoTimerRef.current = null;
      }
    };
  }, [heroReady, isDragging]);

  const clampedDragForClientX = useCallback(
    (clientX: number) => {
      const vw = viewportRef.current?.clientWidth ?? 0;
      if (vw <= 0) return 0;
      const ix = activeIndexRef.current;
      const n = slideCountRef.current;
      const dx = clientX - dragStartClientXRef.current;
      const raw = -ix * vw + dx;
      const clamped = Math.max(-(n - 1) * vw, Math.min(0, raw));
      return clamped + ix * vw;
    },
    [],
  );

  const handleCarouselPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDesktop || reduceMotion) return;
      const el = e.target as HTMLElement;
      if (el.closest("button, a, input, textarea, select, [data-hero-no-drag]")) return;

      if (dragAbortRef.current) {
        dragAbortRef.current.abort();
        dragAbortRef.current = null;
        dragPointerIdRef.current = null;
        setIsDragging(false);
        setDragPx(0);
      }
      const ac = new AbortController();
      dragAbortRef.current = ac;
      const { signal } = ac;
      const pid = e.pointerId;

      dragPointerIdRef.current = pid;
      dragStartClientXRef.current = e.clientX;
      velocityRef.current = { x: e.clientX, t: performance.now() };
      setIsDragging(true);
      setDragPx(0);
      e.preventDefault();
      try {
        viewportRef.current?.setPointerCapture(pid);
      } catch {
        /* ignore */
      }

      const listenOpts: AddEventListenerOptions = { signal, capture: true, passive: false };

      const move = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return;
        ev.preventDefault();
        setDragPx(clampedDragForClientX(ev.clientX));
        velocityRef.current = { x: ev.clientX, t: performance.now() };
      };

      const up = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) return;
        ev.preventDefault();
        try {
          viewportRef.current?.releasePointerCapture(pid);
        } catch {
          /* */
        }
        dragPointerIdRef.current = null;
        dragAbortRef.current = null;
        ac.abort();

        setIsDragging(false);

        const vw = viewportRef.current?.clientWidth ?? 1;
        const effective = clampedDragForClientX(ev.clientX);
        const th = vw * 0.14;
        const { x: vxX, t: vxT } = velocityRef.current;
        const dt = Math.max(1, performance.now() - vxT);
        const vx = ((ev.clientX - vxX) / dt) * 1000;

        let d = 0;
        if (effective < -th || vx < -520) d = 1;
        else if (effective > th || vx > 520) d = -1;

        setDragPx(0);
        if (d !== 0) {
          setActiveIndex((i) => (i + d + slideCountRef.current) % slideCountRef.current);
        }
      };

      window.addEventListener("pointermove", move, listenOpts);
      window.addEventListener("pointerup", up, listenOpts);
      window.addEventListener("pointercancel", up, listenOpts);
    },
    [clampedDragForClientX, isDesktop, reduceMotion],
  );

  const showVideo = activeIndex === 0;
  const carouselTransition =
    reduceMotion || isDragging ? "none" : `transform ${HERO_CAROUSEL_MS}ms ${HERO_CAROUSEL_EASE}`;

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
              draggable={false}
              className="hero-bg-video absolute inset-0 z-0 h-full w-full object-cover object-center transition-opacity duration-500"
              style={{ opacity: showVideo ? 1 : 0 }}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
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
        <div
          ref={viewportRef}
          className={cn(
            "relative min-h-0 flex-1 overflow-hidden touch-pan-y",
            isDesktop && !reduceMotion && "md:cursor-grab md:active:cursor-grabbing",
            isDragging && "cursor-grabbing select-none",
          )}
          onPointerDown={handleCarouselPointerDown}
        >
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {t("hero.srLine", {
              current: String(activeIndex + 1),
              total: String(slideCount),
              caption: liveCaption,
            })}
          </p>
          <div
            className="flex h-full"
            style={{
              width: `${slideCount * 100}%`,
              transform: `translate3d(calc(-${(100 / slideCount) * activeIndex}% + ${dragPx}px), 0, 0)`,
              transition: carouselTransition,
              willChange: reduceMotion || isDragging ? undefined : "transform",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
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
                    <div
                      className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black md:hidden"
                      aria-hidden
                    />
                    <div
                      className={cn(
                        "relative z-[1] flex min-h-[100dvh] min-h-[100svh] w-full items-center justify-center px-4 pb-24 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-28 sm:pt-[calc(5rem+env(safe-area-inset-top,0px))]",
                        "md:absolute md:inset-0 md:min-h-0 md:items-stretch md:justify-stretch md:p-0 md:pb-0 md:pt-0",
                      )}
                    >
                      <div
                        className={cn(
                          "hero-poster-frame w-full max-w-[min(100%,28rem)] sm:max-w-[min(100%,36rem)] md:max-w-none",
                          "md:relative md:h-full md:min-h-[100dvh] md:min-h-[100svh] md:w-full",
                        )}
                      >
                        {slide.srcMobile ? (
                          <picture className="block w-full max-md:block md:absolute md:inset-0 md:h-full md:w-full">
                            <source media="(max-width: 767px)" srcSet={slide.srcMobile} />
                            <img
                              src={slide.src}
                              alt={slide.alt}
                              draggable={false}
                              className="hero-poster-img block w-full rounded-2xl border border-white/15 bg-black/30 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10 sm:rounded-3xl md:h-full md:min-h-full md:w-full md:rounded-none md:border-0 md:ring-0 md:shadow-none"
                              loading={slide.posterId === "poster-prep" ? "eager" : "lazy"}
                              decoding="async"
                              sizes="(max-width: 767px) 100vw, 100vw"
                            />
                          </picture>
                        ) : (
                          <img
                            src={slide.src}
                            alt={slide.alt}
                            draggable={false}
                            className="hero-poster-img block w-full rounded-2xl border border-white/15 bg-black/30 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10 sm:rounded-3xl md:absolute md:inset-0 md:h-full md:min-h-full md:w-full md:rounded-none md:border-0 md:ring-0 md:shadow-none"
                            loading={slide.posterId === "poster-prep" ? "eager" : "lazy"}
                            decoding="async"
                            sizes="(max-width: 767px) 100vw, 100vw"
                          />
                        )}
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
              data-hero-no-drag
              onClick={() => go(-1)}
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white shadow-lg md:bg-black/30 md:backdrop-blur-md transition hover:border-white/45 hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              aria-label={t("hero.prev")}
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <button
              type="button"
              data-hero-no-drag
              onClick={() => go(1)}
              className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white shadow-lg md:bg-black/30 md:backdrop-blur-md transition hover:border-white/45 hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
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
          data-hero-no-drag
          className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white/80 shadow-lg md:bg-white/10 md:backdrop-blur-md transition hover:border-white/40 hover:bg-white/15 hover:text-white"
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
