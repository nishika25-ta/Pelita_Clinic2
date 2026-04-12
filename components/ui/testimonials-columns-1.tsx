import React from "react";
import { motion } from "framer-motion";
import { Quote, Star, UserRound } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { cn } from "@/lib/utils";

/** Single card in a scrolling column (matches shadcn-style demo props). */
export interface TestimonialColumnItem {
  text: string;
  image: string;
  name: string;
  role: string;
}

export interface TestimonialsColumnProps {
  className?: string;
  testimonials: TestimonialColumnItem[];
  duration?: number;
}

export interface TestimonialReviewCardProps {
  item: TestimonialColumnItem;
  className?: string;
}

export function TestimonialReviewCard({ item, className }: TestimonialReviewCardProps) {
  const { t } = useI18n();
  return (
    <article
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-violet-200/35 bg-gradient-to-br from-white/95 via-violet-50/25 to-white/90 p-5 shadow-[0_20px_50px_-18px_rgba(91,33,182,0.22)] ring-1 ring-white/70 md:backdrop-blur-md",
        className,
      )}
      aria-label={t("testimonials.testimonialAria")}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-violet-200/25 to-transparent"
        aria-hidden
      />
      <Quote className="absolute -right-1 -top-1 h-16 w-16 rotate-6 text-violet-300/50" strokeWidth={1} aria-hidden />

      <div className="relative mb-3 flex items-center gap-0.5 text-amber-400" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-current drop-shadow-sm" />
        ))}
      </div>

      <p className="relative text-sm leading-relaxed text-slate-600">{item.text}</p>

      <div className="relative mt-5 flex items-center gap-3 border-t border-violet-100/80 pt-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-600 shadow-inner ring-2 ring-white/90">
          <UserRound className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">
            <span aria-hidden="true" className="inline-block max-w-full select-none blur-[6px]">
              {item.name}
            </span>
            <span className="sr-only">{t("testimonials.anonName")}</span>
          </p>
          <p className="truncate text-xs font-medium text-slate-500">{item.role}</p>
        </div>
      </div>
    </article>
  );
}

const IS_MOBILE = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

export function TestimonialsColumn({ className, testimonials, duration = 15 }: TestimonialsColumnProps) {
  if (IS_MOBILE) {
    return (
      <div className={`flex flex-col gap-5 ${className ?? ""}`}>
        {testimonials.map((item, i) => (
          <TestimonialReviewCard key={`tcol-${i}`} item={item} className="max-w-xs" />
        ))}
      </div>
    );
  }

  const loop = [...testimonials, ...testimonials];
  return (
    <div
      className={`h-[min(560px,62svh)] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] ${className ?? ""}`}
    >
      <motion.div
        animate={{ y: ["0%", "-50%"] }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5 pb-5 will-change-transform"
      >
        {loop.map((item, i) => (
          <TestimonialReviewCard key={`tcol-${i}`} item={item} className="max-w-xs" />
        ))}
      </motion.div>
    </div>
  );
}
