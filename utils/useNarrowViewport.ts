import { useSyncExternalStore } from "react";

/** Tailwind `md` breakpoint — stack UIs mount only when true (avoids Lenis + zero-size layout while `md:hidden`). */
const MOBILE_STACK_MQ = "(max-width: 767px)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(MOBILE_STACK_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_STACK_MQ).matches;
}

function getServerSnapshot() {
  return false;
}

/** True when viewport is narrow enough for mobile-only stack layouts. */
export function useNarrowViewportForStack() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
