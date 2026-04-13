import { Briefcase, Languages, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "../../contexts/I18nContext";
import { CLINIC_INFO, DOCTOR_PROFILE } from "../../config/clinicData";
import { useParallax } from "../../utils/useParallax";

export default function ProfileSection() {
  const { t } = useI18n();
  const { ref, y } = useParallax({ distance: 35 });

  return (
    <section id="profile" className="section-shell overflow-hidden">
      <div className="container-shell grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div ref={ref} style={{ y }} className="relative w-full">
          <div className="absolute inset-0 -translate-x-10 translate-y-10 transform rounded-full bg-violet-100 opacity-60 blur-3xl max-md:hidden" />
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-3xl border-4 border-white shadow-2xl"
            role="region"
            aria-label={t("profile.photoPanelAria")}
          >
            <img
              src={DOCTOR_PROFILE.doctorPhotoSrc}
              alt={DOCTOR_PROFILE.name}
              className="h-full w-full object-cover object-top"
              loading="eager"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </motion.div>

        <div className="w-full space-y-5">
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
