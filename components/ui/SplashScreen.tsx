import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CLINIC_INFO } from "../../config/clinicData";
import { AnimatedText } from "@/components/ui/animated-text";

/** Vite serves `public/logo/logo.png` as `/logo/logo.png`. */
const LOGO_SRC = "/logo/logo.png";

export type SplashScreenProps = {
  onExitStart?: () => void;
  onExitComplete?: () => void;
};

/** Match reference: stagger timing so the full string + underline can finish before dismiss. */
function computeSplashHoldMs(text: string, duration: number, delay: number, reduceMotion: boolean | null): number {
  /* Short intro + ~1s on screen + room for exit animation */
  if (reduceMotion) return 2200;
  const n = Array.from(text).length;
  const delayChildren = delay;
  const staggerSpan = Math.max(0, n - 1) * duration;
  const letterMotionBuffer = 0.55;
  const underlineDelay = n * delay;
  const underlineDuration = 0.8;
  /** Hold splash fully visible this long after letters + underline finish (seconds). */
  const dwellAfterTextDone = 1;
  const seconds =
    delayChildren +
    staggerSpan +
    letterMotionBuffer +
    underlineDelay +
    underlineDuration +
    dwellAfterTextDone;
  return Math.ceil(Math.min(12_000, Math.max(3_800, seconds * 1000)));
}

export default function SplashScreen({ onExitStart, onExitComplete }: SplashScreenProps = {}) {
  const [isVisible, setIsVisible] = useState(true);
  const reduceMotion = useReducedMotion();
  const onExitCompleteRef = useRef(onExitComplete);
  onExitCompleteRef.current = onExitComplete;
  const onExitStartRef = useRef(onExitStart);
  onExitStartRef.current = onExitStart;

  const splashText = CLINIC_INFO.name;

  const staggerDuration = 0.08;
  const staggerDelay = 0.12;
  const holdMs = useMemo(
    () => computeSplashHoldMs(splashText, staggerDuration, staggerDelay, reduceMotion ?? false),
    [splashText, reduceMotion],
  );

  useEffect(() => {
    const t = window.setTimeout(() => {
      onExitStartRef.current?.();
      setIsVisible(false);
    }, holdMs);
    return () => window.clearTimeout(t);
  }, [holdMs]);

  const logoTransition = reduceMotion
    ? { duration: 0.35 }
    : { duration: 1, type: "spring" as const, bounce: 0.4 };

  return (
    <AnimatePresence onExitComplete={() => onExitCompleteRef.current?.()}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#F5F5F7] antialiased [font-family:var(--font-apple)]"
          style={{ WebkitFontSmoothing: "antialiased" }}
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Loading"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.85, ease: [0.42, 0, 1, 1] },
          }}
        >
          <motion.div
            className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#0066CC]/15 blur-[100px]"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: reduceMotion ? 0 : 0.5 }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#FF7A00]/10 blur-[100px]"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: reduceMotion ? 0 : 0.5 }}
          />

          {/* Centered row: logo + title */}
          <div className="relative z-10 flex w-full max-w-[100vw] items-center justify-center px-4 sm:px-6">
            <div className="flex min-w-0 max-w-full flex-wrap items-center justify-center gap-5 sm:gap-8 md:gap-10">
              <motion.div
                initial={
                  reduceMotion ? { opacity: 0, scale: 0.96 } : { scale: 0, rotate: -180 }
                }
                animate={reduceMotion ? { opacity: 1, scale: 1 } : { scale: 1, rotate: 0 }}
                transition={logoTransition}
                className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-3xl border border-gray-200/90 bg-white shadow-[0_20px_40px_-10px_rgba(0,102,204,0.18)] sm:h-20 sm:w-20"
              >
                <img
                  src={LOGO_SRC}
                  alt=""
                  className="h-[68%] w-[68%] object-contain"
                  decoding="async"
                />
              </motion.div>

              <AnimatedText
                text={splashText}
                textClassName="text-center text-4xl font-bold tracking-[-0.04em] text-[#1D1D1F] sm:text-5xl md:text-6xl lg:text-7xl"
                duration={staggerDuration}
                delay={staggerDelay}
                underlineGradient="from-[#0066CC] via-[#00A8E8] to-[#FF7A00]"
                underlineHeight="h-1.5"
                underlineOffset="-bottom-2.5"
                replay
                className="min-w-0 items-center justify-center"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
