import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import type { LenisOptions } from "lenis";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const options = useMemo(() => (isMobile ? mobileOptions : desktopOptions), [isMobile]);
  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}

export { useLenis } from "lenis/react";
