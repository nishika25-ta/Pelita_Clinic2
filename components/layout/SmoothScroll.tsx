import { useMemo, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import type { LenisOptions } from "lenis";

const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

const baseLenisOptions: LenisOptions = {
  lerp: 0.088,
  wheelMultiplier: 0.92,
  smoothWheel: true,
  autoRaf: true,
  anchors: true,
  allowNestedScroll: true,
};

const desktopOptions: LenisOptions = {
  ...baseLenisOptions,
  touchMultiplier: 1.08,
  syncTouch: true,
  syncTouchLerp: 0.075,
};

const mobileOptions: LenisOptions = {
  ...baseLenisOptions,
  touchMultiplier: 1,
  syncTouch: false,
};

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const options = useMemo(() => (isMobile ? mobileOptions : desktopOptions), []);
  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}

export { useLenis } from "lenis/react";
