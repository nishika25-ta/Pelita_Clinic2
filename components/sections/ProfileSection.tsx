import { useCallback, useEffect, useRef, useState } from "react";
import { Briefcase, ChevronLeft, ChevronRight, Languages, Stethoscope } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "../../contexts/I18nContext";
import { CLINIC_INFO, DOCTOR_PROFILE } from "../../config/clinicData";
import { useParallax } from "../../utils/useParallax";

const SLIDE_COUNT = 2;

export default function ProfileSection() {
  const { t } = useI18n();
  const { ref, y } = useParallax({ distance: 35 });
  const [activeSlide, setActiveSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  const go = useCallback((delta: number) => {
    setActiveSlide((i) => (i + delta + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    if (activeSlide !== 1) {
      videoRef.current?.pause();
    }
  }, [activeSlide]);

  return (
    <section id="profile" className="section-shell overflow-hidden">
      <div className="container-shell grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div ref={ref} style={{ y }} className="relative w-full">
          <div className="absolute inset-0 -translate-x-10 translate-y-10 transform rounded-full bg-violet-100 opacity-60 blur-3xl max-md:hidden" />
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-3xl border-4 border-white shadow-2xl"
            role="region"
            aria-roledescription="carousel"
            aria-label={t("profile.carouselAria")}
          >
            <div
              className="flex h-full w-[200%] transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${activeSlide * 50}%)`,
                transition: reduceMotion ? "none" : undefined,
              }}
            >
              {/* Slide 0 — photo placeholder */}
              <div className="relative h-full w-1/2 shrink-0">
                <div className="flex h-full w-full items-center justify-center bg-violet-50 text-center text-violet-500">
                  <div className="px-4">
                    <p className="text-lg font-semibold">{t("profile.photoTitle")}</p>
                    <p className="mt-1 text-sm">{t("profile.photoHint")}</p>
                  </div>
                </div>
              </div>
              {/* Slide 1 — doctor intro video */}
              <div className="relative h-full w-1/2 shrink-0 bg-slate-950">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  src={DOCTOR_PROFILE.introVideoSrc}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={t("profile.videoAria")}
                />
                <p className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/65 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white md:bg-black/55 md:backdrop-blur-sm">
                  {t("profile.drVideoBadge")}
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-between px-2">
              <button
                type="button"
                onClick={() => go(-1)}
                className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white shadow-lg md:bg-black/40 md:backdrop-blur-md transition hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={t("profile.prevSlide")}
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white shadow-lg md:bg-black/40 md:backdrop-blur-md transition hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label={t("profile.nextSlide")}
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center gap-2">
              {[0, 1].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  className={`h-2 rounded-full transition-all ${activeSlide === i ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/75"}`}
                  aria-label={i === 0 ? t("profile.dotPhoto") : t("profile.dotVideo")}
                  aria-current={activeSlide === i ? "true" : undefined}
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-slate-900/80 to-transparent p-6 pt-24">
              <p className="flex items-center gap-2 text-sm font-medium text-white">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                {t("profile.walkins")}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="w-full space-y-5">
          <p className="section-subtitle">{t("profile.section")}</p>
          <h2 className="section-title">{t("profile.title")}</h2>
          <div className="glass-card p-6">
            <h3 className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-2xl font-bold tracking-tight text-slate-900">
              <span>{DOCTOR_PROFILE.name}</span>
              <span>{t("profile.resumeSuffix")}</span>
            </h3>
            <p className="mb-5 text-base text-violet-700">{DOCTOR_PROFILE.designation}</p>
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50">
                  <Briefcase className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t("profile.qualHeading")}</h4>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    {DOCTOR_PROFILE.qualifications.map((q) => (
                      <li key={q} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                        {q}
                      </li>
                    ))}
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                      {DOCTOR_PROFILE.experience} {t("profile.experienceSuffix")}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50">
                  <Languages className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{t("profile.langHeading")}</h4>
                  <p className="mt-1 text-sm text-slate-600">{DOCTOR_PROFILE.languages}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-700">
              <Stethoscope className="h-4 w-4" />
              {t("profile.clinicIdentity")}
            </h4>
            <div className="mb-3 flex items-center gap-3">
              <img
                src="/logo/logo.png"
                alt={`${CLINIC_INFO.name} logo`}
                className="h-12 w-12 rounded-full border border-violet-200 bg-white object-cover shadow-sm"
                loading="lazy"
                decoding="async"
              />
              <p className="text-sm font-semibold text-slate-800">{CLINIC_INFO.name}</p>
            </div>
            <p className="text-sm text-slate-700">
              <strong>{CLINIC_INFO.name}</strong> · {t("profile.established")} {CLINIC_INFO.established}
            </p>
            <p className="mt-2 text-sm text-slate-600">{CLINIC_INFO.type}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
