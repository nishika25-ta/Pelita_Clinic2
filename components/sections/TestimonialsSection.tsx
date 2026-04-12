import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { Star } from "lucide-react";
import { useI18n } from "../../contexts/I18nContext";
import { TESTIMONIALS } from "../../config/clinicData";
import {
  TestimonialReviewCard,
  TestimonialsColumn,
  type TestimonialColumnItem,
} from "@/components/ui/testimonials-columns-1";

interface TestimonialsSectionProps {
  yTestimonial: MotionValue<string>;
}

/** Stock portraits (Unsplash) — decorative avatars for column cards. */
const COLUMN_AVATARS: string[] = [
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&face",
];

function toColumnItems(): TestimonialColumnItem[] {
  return TESTIMONIALS.map((t, i) => ({
    text: t.text,
    name: t.name,
    role: `${t.platform} · ${t.date}`,
    image: COLUMN_AVATARS[i % COLUMN_AVATARS.length] ?? COLUMN_AVATARS[0],
  }));
}

export default function TestimonialsSection({ yTestimonial }: TestimonialsSectionProps) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const columnData = toColumnItems();
  const firstColumn = columnData.slice(0, 3);
  const secondColumn = columnData.slice(3, 6);
  const thirdColumn = columnData.slice(6, 9);

  return (
    <section id="reviews" className="section-shell relative overflow-hidden">
      <motion.div
        className="absolute inset-0 w-full h-[150%] -top-[25%] bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1582750433449-648ed127d09b?q=80&w=2069&auto=format&fit=crop")',
          y: yTestimonial,
        }}
      />
      <div className="container-shell relative z-10">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="section-subtitle mb-2">{t("testimonials.section")}</p>
          <h2 className="section-title mb-4">{t("testimonials.title")}</h2>
          <p className="text-slate-600">{t("testimonials.subtitle")}</p>
          <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-stretch gap-5 overflow-hidden rounded-3xl border border-violet-200/40 bg-gradient-to-br from-white/95 via-violet-50/35 to-fuchsia-50/20 p-5 shadow-[0_24px_60px_-24px_rgba(91,33,182,0.28)] ring-1 ring-white/70 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
            <div className="flex shrink-0 justify-center sm:justify-start">
              <img
                src="/Five-Star-Google-Review-Recognition-PNG.png"
                alt="Google five-star review recognition banner"
                className="h-14 w-auto object-contain drop-shadow-sm sm:h-16"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-600">{t("testimonials.googleReviews")}</p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{t("testimonials.avgRating")}</p>
              <p className="mt-1 text-sm leading-snug text-slate-600">{t("testimonials.ratingNote")}</p>
            </div>
            <div className="flex shrink-0 items-center justify-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={`badge-${i}`} className="h-5 w-5 fill-current drop-shadow-sm" />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 md:gap-6 mt-6 pb-2">
          {reduceMotion === true ? (
            <div className="grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {columnData.map((item, idx) => (
                <TestimonialReviewCard key={`static-${idx}`} item={item} className="h-full max-w-none" />
              ))}
            </div>
          ) : (
            <>
              <TestimonialsColumn testimonials={firstColumn} duration={15} />
              <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
              <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
