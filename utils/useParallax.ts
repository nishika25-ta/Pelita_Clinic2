import { useRef, type RefObject } from "react";
import { useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface UseParallaxOptions {
  /** Peak translate in px (each direction). Disabled when reduced motion is on. */
  distance?: number;
}

export function useParallax(options: UseParallaxOptions = {}): {
  ref: RefObject<HTMLDivElement | null>;
  y: MotionValue<string>;
} {
  const reduceMotion = useReducedMotion();
  const distance = reduceMotion ? 0 : (options.distance ?? 40);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${distance}px`, `${distance}px`]);

  return { ref, y };
}
