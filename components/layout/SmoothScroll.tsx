import { type ReactNode } from "react";
import { ReactLenis } from "lenis/react";

/** Shared Lenis config — tuned for smooth wheel + anchor jumps (hash links). */
const lenisOptions = {
  lerp: 0.088,
  wheelMultiplier: 0.92,
  touchMultiplier: 1.08,
  smoothWheel: true,
  syncTouch: true,
  syncTouchLerp: 0.075,
  autoRaf: true,
  anchors: true,
  /** Lets `overflow: auto` regions (e.g. hero card stacks) receive wheel/touch instead of Lenis. */
  allowNestedScroll: true,
} as const;

interface SmoothScrollProps {
  children: ReactNode;
}

/**
 * Global Lenis smooth scroll (root instance). Pairs with Framer Motion `useScroll` /
 * `useTransform` parallax on the page.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}

export { useLenis } from "lenis/react";
