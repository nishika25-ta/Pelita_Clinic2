import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "../../contexts/I18nContext";
import { CLINIC_INFO } from "../../config/clinicData";
import { getOrderedHeroPosters, HERO_POSTERS } from "../../config/heroSectionContent";
import "./HeroSection.css";

interface HeroSectionProps {
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

/** Reception photo — `public/image/herro.jpg` → `/image/herro.jpg`. Shown only on the first slide (tablet/desktop). */
const HERO_MAIN_IMAGE_SRC = "/image/new_hero.jpg";

/** Hero slide strip — horizontal pan; `translate3d` keeps it on the GPU (smoother on mobile). */
const HERO_CAROUSEL_MS_MOBILE = 840;
const HERO_CAROUSEL_MS_DESKTOP = 980;
const HERO_CAROUSEL_EASE_MANUAL = "cubic-bezier(0.33, 1, 0.68, 1)";
const HERO_CAROUSEL_EASE_AUTO_DESKTOP = "cubic-bezier(0.22, 0.95, 0.28, 1)";

/** Autoplay: longer on the opening main slide, standard cadence on posters and highlights. */
const HERO_AUTOPLAY_MAIN_MS = 10_000;
const HERO_AUTOPLAY_OTHER_MS = 5000;

type HeroSlide =
  | { kind: "main" }
  | { kind: "poster"; posterId: string; src: string; srcMobile?: string; alt: string };

export default function HeroSection({ splashReveal }: HeroSectionProps) {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.08 });
  const reduceMotion = useReducedMotion();
  const heroReady = splashReveal === undefined ? isInView : splashReveal;

  const slides = useMemo<HeroSlide[]>(
    () => [
      { kind: "main" },
      ...getOrderedHeroPosters(HERO_POSTERS).map((p) => ({
        kind: "poster" as const,
        posterId: p.id,
        src: p.src,
        srcMobile: p.srcMobile,
        alt: t(`hero.posters.${p.id}.alt`),
      })),
    ],
    [t],
  );
  const slideCount = slides.length;
  const slideCountRef = useRef(slideCount);
  slideCountRef.current = slideCount;

  const [activeIndex, setActiveIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragStartClientXRef = useRef(0);
  const velocityRef = useRef({ x: 0, t: 0 });
  const dragAbortRef = useRef<AbortController | null>(null);
  const transitionModeRef = useRef<"manual" | "auto">("manual");

  activeIndexRef.current = activeIndex;

  useEffect(
    () => () => {
      dragAbortRef.current?.abort();
      dragAbortRef.current = null;
    },
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const go = useCallback(
    (delta: number) => {
      transitionModeRef.current = "manual";
      setDragPx(0);
      setActiveIndex((i) => (i + delta + slideCount) % slideCount);
    },
    [slideCount],
  );

  /** Autoplay: 10s on the main slide, 5s on posters. Reschedules when the slide changes.
   *  Pauses while the user is dragging. Same behavior on mobile and desktop. */
  useEffect(() => {
    if (!heroReady || isDragging) {
      if (autoAdvanceTimerRef.current !== null) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
      return;
    }
    if (autoAdvanceTimerRef.current !== null) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    const holdMs = activeIndex === 0 ? HERO_AUTOPLAY_MAIN_MS : HERO_AUTOPLAY_OTHER_MS;
    autoAdvanceTimerRef.current = window.setTimeout(() => {
      autoAdvanceTimerRef.current = null;
      transitionModeRef.current = "auto";
      setActiveIndex((i) => (i + 1) % slideCountRef.current);
    }, holdMs);
    return () => {
      if (autoAdvanceTimerRef.current !== null) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
    };
  }, [heroReady, isDragging, activeIndex]);

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
      if (reduceMotion) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
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
          transitionModeRef.current = "manual";
          setActiveIndex((i) => (i + d + slideCountRef.current) % slideCountRef.current);
        }
      };

      window.addEventListener("pointermove", move, listenOpts);
      window.addEventListener("pointerup", up, listenOpts);
      window.addEventListener("pointercancel", up, listenOpts);
    },
    [clampedDragForClientX, reduceMotion],
  );

  const showMainBackdrop = true;
  const carouselDurationMs = isDesktop ? HERO_CAROUSEL_MS_DESKTOP : HERO_CAROUSEL_MS_MOBILE;
  const carouselEase =
    isDesktop && transitionModeRef.current === "auto" ? HERO_CAROUSEL_EASE_AUTO_DESKTOP : HERO_CAROUSEL_EASE_MANUAL;
  const carouselTransition = reduceMotion || isDragging ? "none" : `transform ${carouselDurationMs}ms ${carouselEase}`;

  const liveCaption = useMemo(() => {
    const s = slides[activeIndex];
    if (!s) return "";
    if (s.kind === "main") return t("hero.liveMain");
    return s.alt;
  }, [slides, activeIndex, t]);

  return (
    <section
      ref={sectionRef}
      id="home"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("hero.carouselAria")}
      className="hero-section relative isolate flex min-h-[100dvh] min-h-[100svh] flex-col overflow-hidden text-white [font-family:var(--font-apple)] antialiased [perspective:1400px]"
      style={{ WebkitFontSmoothing: "antialiased" }}
    >
      {/* Layered backdrop: deep bloom (slow), photo (mid), read overlay (fast) — parallax vs scroll through hero. */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="hero-parallax-root absolute inset-[0_-6%] top-[-10%] h-[120%] w-[112%] max-w-none">
          <motion.div
            className="hero-parallax-layer pointer-events-none absolute inset-[-8%] z-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_108%,rgba(124,58,237,0.42),transparent_58%)] transition-opacity duration-500"
            style={{
              opacity: showMainBackdrop ? 0.85 : 0,
            }}
          />
          <div className="absolute inset-0 z-[1] overflow-hidden">
            <motion.div
              className="hero-bg-photo hero-parallax-layer absolute inset-0 z-0 h-full w-full transition-opacity duration-500"
              style={{
                opacity: showMainBackdrop ? 1 : 0,
                scale: 1.04,
              }}
            >
              <img
                src={HERO_MAIN_IMAGE_SRC}
                alt=""
                draggable={false}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover object-center"
              />
            </motion.div>
          </div>
          <motion.div
            className="hero-parallax-layer absolute inset-0 z-[2] bg-gradient-to-b from-black/50 via-black/42 to-black/62 transition-opacity duration-500"
            style={{
              opacity: showMainBackdrop ? 1 : 0,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(0,0,0,0.22),transparent_72%)] transition-opacity duration-500"
            style={{ opacity: showMainBackdrop ? 1 : 0 }}
          />
        </div>
      </div>

      <motion.div
        className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden will-change-transform"
      >
        <div
          ref={viewportRef}
          className={cn(
            "relative min-h-0 flex-1 overflow-hidden touch-pan-y",
            !reduceMotion && "md:cursor-grab md:active:cursor-grabbing",
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
            {slides.map((slide, slideIndex) => (
              <div
                key={slide.kind === "main" ? "main" : slide.posterId}
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
                    <div className="pointer-events-none absolute inset-0 z-0 bg-transparent md:hidden" aria-hidden />
                    <div
                      className={cn(
                        "relative z-[1] flex min-h-[100dvh] min-h-[100svh] w-full items-center justify-center px-4 pb-24 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:px-6 sm:pb-28 sm:pt-[calc(5rem+env(safe-area-inset-top,0px))]",
                        "md:px-8 md:pb-32 md:pt-[calc(6rem+env(safe-area-inset-top,0px))] lg:px-12",
                      )}
                    >
                      <div
                        className={cn(
                          "hero-poster-frame w-full max-w-[min(100%,28rem)] sm:max-w-[min(100%,36rem)] md:max-w-none",
                          "md:w-full md:max-w-[min(100%,64rem)] lg:max-w-[min(100%,74rem)]",
                        )}
                      >
                        {slide.srcMobile ? (
                          <picture className="block w-full">
                            <source media="(max-width: 767px)" srcSet={slide.srcMobile} />
                            <img
                              src={slide.src}
                              alt={slide.alt}
                              draggable={false}
                              className="hero-poster-img block w-full rounded-2xl border border-white/15 bg-transparent shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10 sm:rounded-3xl md:rounded-3xl"
                              loading={slideIndex <= 2 ? "eager" : "lazy"}
                              fetchPriority={slideIndex <= 2 ? "high" : "auto"}
                              decoding="async"
                              sizes="(max-width: 767px) 100vw, 100vw"
                            />
                          </picture>
                        ) : (
                          <img
                            src={slide.src}
                            alt={slide.alt}
                            draggable={false}
                            className="hero-poster-img block w-full rounded-2xl border border-white/15 bg-transparent shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/10 sm:rounded-3xl md:rounded-3xl"
                            loading={slideIndex <= 2 ? "eager" : "lazy"}
                            fetchPriority={slideIndex <= 2 ? "high" : "auto"}
                            decoding="async"
                            sizes="(max-width: 767px) 100vw, 100vw"
                          />
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                    <motion.div
                      variants={blockReveal}
                      initial="hidden"
                      animate={heroReady && activeIndex === 0 ? "visible" : "hidden"}
                      className="flex flex-col items-center"
                    >
                      <motion.h1
                        variants={fadeUp}
                        className="rounded-2xl border border-white/30 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),rgba(255,255,255,0.12))] px-5 py-4 text-balance text-4xl font-black leading-[1.05] tracking-[-0.04em] shadow-[0_28px_65px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/15 backdrop-blur-[12px] sm:px-7 sm:py-5 sm:text-6xl md:rounded-3xl md:px-10 md:py-7 md:text-7xl md:backdrop-blur-[16px] lg:text-8xl"
                      >
                        <span className="block text-white [text-shadow:0_1px_2px_rgba(15,23,42,0.45)] md:[text-shadow:none] md:[-webkit-text-stroke:0.8px_rgba(15,23,42,0.55)]">
                          {t("hero.mainLine1")}
                        </span>
                        <span className="mt-1 block text-[#8B5CF6] [text-shadow:0_1px_2px_rgba(46,16,101,0.45)] md:[text-shadow:none] md:[-webkit-text-stroke:0.8px_rgba(46,16,101,0.55)] sm:mt-2">
                          {t("hero.mainLine2")}
                        </span>
                      </motion.h1>

                      <motion.p
                        variants={fadeUp}
                        className="mt-8 max-w-2xl text-pretty text-base font-normal leading-relaxed text-white/90 sm:mt-10 sm:text-lg"
                      >
                        {t("hero.intro", { name: CLINIC_INFO.name })}
                      </motion.p>
                    </motion.div>
                  </div>
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
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
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
      </motion.div>
    </section>
  );
}
