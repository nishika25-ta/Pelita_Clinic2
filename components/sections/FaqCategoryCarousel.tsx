import { useCallback, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { FaqCategory } from "../../locales/faqContent";
import { cn } from "@/lib/utils";
import "./FaqSection.css";

type Accent = "violet" | "teal";

const accentStyles: Record<
  Accent,
  {
    shell: string;
    badge: string;
    btn: string;
    dotOn: string;
    dotOff: string;
    progress: string;
  }
> = {
  violet: {
    shell: "border-violet-200/70 bg-gradient-to-br from-white via-violet-50/40 to-white shadow-[0_24px_60px_-28px_rgba(91,33,182,0.22)] ring-1 ring-violet-100/60",
    badge: "border-violet-200/60 bg-violet-50/90 text-violet-800",
    btn: "border-violet-200/80 bg-white text-violet-700 hover:border-violet-300 hover:bg-violet-50/80",
    dotOn: "bg-violet-600 w-8",
    dotOff: "bg-violet-200/80 hover:bg-violet-300/90 w-2.5",
    progress: "from-violet-500 to-fuchsia-500",
  },
  teal: {
    shell: "border-teal-200/70 bg-gradient-to-br from-white via-teal-50/35 to-white shadow-[0_24px_60px_-28px_rgba(13,148,136,0.18)] ring-1 ring-teal-100/60",
    badge: "border-teal-200/60 bg-teal-50/90 text-teal-900",
    btn: "border-teal-200/80 bg-white text-teal-800 hover:border-teal-300 hover:bg-teal-50/80",
    dotOn: "bg-teal-600 w-8",
    dotOff: "bg-teal-200/80 hover:bg-teal-300/90 w-2.5",
    progress: "from-teal-500 to-cyan-500",
  },
};

function FaqAccordionItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="faq-details group/d border-2 border-slate-300/90 bg-white/95 shadow-sm transition-[border-color,box-shadow] hover:border-slate-400 open:border-violet-400/90 open:shadow-md max-sm:rounded-xl sm:rounded-2xl">
      <summary
        className={cn(
          "faq-summary touch-manipulation flex min-h-[3rem] cursor-pointer select-none items-start gap-2.5 rounded-2xl px-3 py-3.5 text-left max-sm:rounded-xl sm:min-h-[3.25rem] sm:gap-3 sm:px-5 sm:py-4",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400/80",
          "max-sm:active:bg-slate-50/80",
        )}
      >
        <span className="faq-icon-ring mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-300/90 bg-slate-100 text-slate-600 transition-colors duration-200 sm:h-10 sm:w-10">
          <ChevronDown className="faq-chevron h-3.5 w-3.5 transition-transform duration-200 sm:h-4 sm:w-4" strokeWidth={2.25} aria-hidden />
        </span>
        <span className="min-w-0 flex-1 pt-0.5 text-pretty break-words text-[0.9375rem] font-medium leading-snug text-slate-900 sm:pt-1 sm:text-base md:text-[1.0625rem]">
          {q}
        </span>
      </summary>
      <div className="border-t-2 border-slate-200/90 bg-slate-50/70 px-3 pb-3.5 pl-[2.65rem] pr-3 pt-2 max-sm:pl-[2.55rem] sm:px-5 sm:pb-5 sm:pl-[3.85rem] sm:pr-5">
        <p className="text-pretty break-words text-[0.9375rem] leading-relaxed text-slate-600 sm:text-base md:text-[1.0625rem] md:leading-[1.65]">
          {a}
        </p>
      </div>
    </details>
  );
}

type FaqCategoryCarouselProps = {
  slides: FaqCategory[];
  bundleLabel: string;
  accent: Accent;
  prevLabel: string;
  nextLabel: string;
  dotLabel: (title: string) => string;
  selectedSuffix: string;
  regionAria: string;
};

export function FaqCategoryCarousel({
  slides,
  bundleLabel,
  accent,
  prevLabel,
  nextLabel,
  dotLabel,
  selectedSuffix,
  regionAria,
}: FaqCategoryCarouselProps) {
  const reduceMotion = useReducedMotion();
  const uid = useId();
  const [index, setIndex] = useState(0);
  const n = slides.length;
  const safeIndex = n > 0 ? ((index % n) + n) % n : 0;
  const a = accentStyles[accent];

  const go = useCallback(
    (delta: number) => {
      if (n < 1) return;
      setIndex((i) => (i + delta + n) % n);
    },
    [n],
  );

  if (n === 0) return null;

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div
      className={cn("relative overflow-hidden rounded-[1.35rem] border-2 p-1 sm:rounded-3xl sm:p-2", a.shell)}
      role="region"
      aria-roledescription="carousel"
      aria-label={regionAria}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-[radial-gradient(120%_80%_at_0%_0%,rgba(255,255,255,0.92),transparent_55%)] sm:rounded-[1.65rem]" aria-hidden />

      <div className="relative rounded-2xl border border-white/60 bg-white/60 p-4 md:bg-white/40 md:backdrop-blur-sm sm:rounded-2xl sm:p-6 md:p-7">
        <div className="mb-4 flex flex-col items-center gap-2 sm:mb-5">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] sm:text-xs",
              a.badge,
            )}
          >
            {bundleLabel}
          </span>
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {slides[safeIndex]?.title}
          </p>
        </div>

        <div className="relative min-h-[min(28rem,62svh)] w-full overflow-hidden sm:min-h-[30rem]">
          <motion.div
            className="flex h-full"
            style={{ width: `${n * 100}%` }}
            animate={{ x: `-${(safeIndex * 100) / n}%` }}
            transition={transition}
          >
            {slides.map((category, si) => (
              <div
                key={`${uid}-${category.title}-${si}`}
                className="shrink-0 px-0.5 sm:px-1"
                style={{ width: `${100 / n}%` }}
                {...(si !== safeIndex ? { "aria-hidden": true as const } : {})}
              >
                <h3 className="mb-4 text-center text-base font-bold leading-snug text-slate-900 sm:mb-5 sm:text-lg md:text-xl">
                  {category.title}
                </h3>
                <ul className="mx-auto flex max-w-2xl flex-col gap-2.5 sm:gap-3" role="list">
                  {category.items.map((item, ii) => (
                    <li key={`${si}-${ii}`} className="list-none">
                      <FaqAccordionItem q={item.q} a={item.a} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative mx-auto mt-6 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-200/90 sm:mt-8 sm:max-w-sm" aria-hidden>
          <motion.div
            className={cn("absolute top-0 h-full rounded-full bg-gradient-to-r shadow-sm", a.progress)}
            style={{ width: `${100 / n}%` }}
            initial={false}
            animate={{ left: `${(safeIndex * 100) / n}%` }}
            transition={transition}
          />
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 sm:mt-8">
          <nav
            className="flex max-w-full flex-wrap items-center justify-center gap-1.5 px-1 sm:gap-2"
            aria-label={bundleLabel}
          >
            {slides.map((cat, di) => (
              <button
                key={cat.title}
                type="button"
                aria-label={di === safeIndex ? `${dotLabel(cat.title)}${selectedSuffix}` : dotLabel(cat.title)}
                onClick={() => setIndex(di)}
                className={cn(
                  "h-2.5 shrink-0 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
                  di === safeIndex ? a.dotOn : a.dotOff,
                )}
              />
            ))}
          </nav>

          <div className="flex w-full max-w-xs items-center justify-between gap-3 sm:max-w-sm">
            <button
              type="button"
              onClick={() => go(-1)}
              className={cn(
                "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition sm:h-12 sm:w-12",
                a.btn,
              )}
              aria-label={prevLabel}
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
            <span className="text-center text-xs font-medium tabular-nums text-slate-500 sm:text-sm">
              {safeIndex + 1} / {n}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className={cn(
                "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition sm:h-12 sm:w-12",
                a.btn,
              )}
              aria-label={nextLabel}
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
