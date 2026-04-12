import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import "./ScrollStack.css";

export type ScrollStackItemProps = {
  itemClassName?: string;
  children: ReactNode;
};

export function ScrollStackItem({ children, itemClassName = "" }: ScrollStackItemProps) {
  return (
    <div
      className={`scroll-stack-card relative my-8 box-border w-full origin-top rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] will-change-transform ${itemClassName}`.trim()}
      style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

export type ScrollStackProps = {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
};

type CardTransform = { translateY: number; scale: number; rotation: number; blur: number };

export default function ScrollStack({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration: _scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, CardTransform>());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return typeof value === "number" ? value : parseFloat(String(value));
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return { scrollTop: window.scrollY, containerHeight: window.innerHeight };
    }
    const scroller = scrollerRef.current;
    return {
      scrollTop: scroller ? scroller.scrollTop : 0,
      containerHeight: scroller ? scroller.clientHeight : 0,
    };
  }, [useWindowScroll]);

  // Use element.offsetTop for inner scroll — stable, doesn't shift during animation.
  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        return element.getBoundingClientRect().top + window.scrollY;
      }
      return element.offsetTop;
    },
    [useWindowScroll],
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? (document.querySelector(".scroll-stack-end") as HTMLElement | null)
      : (scrollerRef.current?.querySelector(".scroll-stack-end") as HTMLElement | null);
    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCard = cardsRef.current[j];
          if (!jCard) continue;
          const jTriggerStart = getElementOffset(jCard) - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) topCardIndex = j;
        }
        if (i < topCardIndex) blur = Math.max(0, (topCardIndex - i) * blurAmount);
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newT: CardTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const lastT = lastTransformsRef.current.get(i);
      const changed =
        !lastT ||
        Math.abs(lastT.translateY - newT.translateY) > 0.1 ||
        Math.abs(lastT.scale - newT.scale) > 0.001 ||
        Math.abs(lastT.rotation - newT.rotation) > 0.1 ||
        Math.abs(lastT.blur - newT.blur) > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0, ${newT.translateY}px, 0) scale(${newT.scale}) rotate(${newT.rotation}deg)`;
        card.style.filter = newT.blur > 0 ? `blur(${newT.blur}px)` : "";
        lastTransformsRef.current.set(i, newT);
      }

      if (i === cardsRef.current.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!inView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale,
    rotationAmount, blurAmount, useWindowScroll, onStackComplete,
    calculateProgress, parsePercentage, getScrollData, getElementOffset,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      // Root ReactLenis already handles window scroll — just listen passively.
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll);
      return;
    }

    const scroller = scrollerRef.current;
    if (!scroller) return;
    const content = scroller.querySelector(".scroll-stack-inner") as HTMLElement | null;
    if (!content) return;

    // Create a dedicated inner Lenis for this scroller.
    const lenis = new Lenis({
      wrapper: scroller,
      content,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      gestureOrientation: "vertical",
      wheelMultiplier: 1,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
    });

    lenis.on("scroll", handleScroll);

    // Use `lenis` directly in the closure — NOT `lenisRef.current`, which is set
    // after this callback, so it would be null on the very first frame.
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);

    lenisRef.current = lenis;
  }, [useWindowScroll, handleScroll]);

  useLayoutEffect(() => {
    if (!useWindowScroll && !scrollerRef.current) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll(".scroll-stack-card")
        : (scrollerRef.current?.querySelectorAll(".scroll-stack-card") ?? []),
    ) as HTMLElement[];

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translateZ(0)";
      (card.style as CSSStyleDeclaration & { webkitTransform: string }).webkitTransform = "translateZ(0)";
    });

    setupLenis();
    updateCardTransforms();

    const scroller = scrollerRef.current;
    const ro = !useWindowScroll && scroller ? new ResizeObserver(() => {
      lenisRef.current?.resize();
      updateCardTransforms();
    }) : null;
    if (ro && scroller) ro.observe(scroller);

    return () => {
      if (useWindowScroll) {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      } else {
        ro?.disconnect();
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        if (lenisRef.current) {
          lenisRef.current.destroy();
          lenisRef.current = null;
        }
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance, itemScale, itemStackDistance, stackPosition, scaleEndPosition,
    baseScale, rotationAmount, blurAmount, useWindowScroll, onStackComplete,
    setupLenis, handleScroll, updateCardTransforms,
  ]);

  return (
    <div
      ref={scrollerRef}
      className={`scroll-stack-scroller relative h-full w-full overflow-y-auto overflow-x-visible ${className}`.trim()}
      data-lenis-prevent-touch
      data-lenis-prevent-wheel
      style={{
        overscrollBehavior: "contain",
        WebkitOverflowScrolling: "touch",
        // Do NOT use scroll-behavior: smooth here — it fights Lenis's
        // scrollTo({ behavior: 'instant' }) and breaks scroll tracking.
        scrollBehavior: "auto",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        willChange: "scroll-position",
      }}
    >
      <div className="scroll-stack-inner min-h-screen pt-[20vh] pb-[50rem] px-4 sm:px-8">
        {children}
        <div className="scroll-stack-end h-px w-full" aria-hidden />
      </div>
    </div>
  );
}
