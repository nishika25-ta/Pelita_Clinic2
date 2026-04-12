import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "../../contexts/I18nContext";
import { CLINIC_INFO } from "../../config/clinicData";
import { getWhatsAppLink } from "../../utils/contact";
import { useParallax } from "../../utils/useParallax";

export default function ContactSection() {
  const { t } = useI18n();
  const { ref, y } = useParallax({ distance: 25 });

  return (
    <section id="contact" className="section-shell">
      <div className="container-shell">
        <div className="mb-10 text-center">
          <p className="section-subtitle mb-2">{t("contact.section")}</p>
          <h2 className="section-title mb-3">{t("contact.title")}</h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            {CLINIC_INFO.appointmentPolicy} {t("contact.leadSuffix")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="glass-card p-6 sm:p-7">
              <h3 className="mb-5 text-2xl font-bold text-slate-900">{t("contact.visitTitle")}</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-white"><MapPin className="h-6 w-6 text-violet-500" /></div>
                  <div>
                    <h4 className="mb-1 font-bold text-slate-900">{t("contact.location")}</h4>
                    <p className="max-w-xs text-sm text-slate-600">{CLINIC_INFO.address}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {t("contact.areaPrefix")} {CLINIC_INFO.area}
                    </p>
                    <a href={CLINIC_INFO.mapsLink} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-violet-700 hover:underline">
                      {t("contact.mapsLink")}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-white"><Clock className="h-6 w-6 text-violet-500" /></div>
                  <div>
                    <h4 className="mb-1 font-bold text-slate-900">{t("contact.hoursTitle")}</h4>
                    <p className="text-sm font-medium text-slate-900">{CLINIC_INFO.days}</p>
                    <ul className="mt-1 space-y-1 text-sm text-slate-600">{CLINIC_INFO.hours.map((h) => <li key={h}>{h}</li>)}</ul>
                    <p className="mt-2 text-xs font-medium text-rose-500">*{CLINIC_INFO.holidays}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-white"><Phone className="h-6 w-6 text-violet-500" /></div>
                  <div>
                    <h4 className="mb-1 font-bold text-slate-900">{t("contact.phoneBlock")}</h4>
                    <a href={`tel:${CLINIC_INFO.phone}`} className="text-sm font-semibold text-slate-800 hover:text-violet-700">{CLINIC_INFO.phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-white"><Mail className="h-6 w-6 text-violet-500" /></div>
                  <div>
                    <h4 className="mb-1 font-bold text-slate-900">{t("contact.email")}</h4>
                    <a href={`mailto:${CLINIC_INFO.email}`} className="text-sm font-semibold text-slate-800 hover:text-violet-700">{CLINIC_INFO.email}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="glass-card p-5">
                <h4 className="mb-3 font-bold text-slate-900">{t("contact.amenities")}</h4>
                <div className="flex flex-wrap gap-2">
                  {CLINIC_INFO.amenities.map((amenity) => (
                    <span key={amenity} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">{amenity}</span>
                  ))}
                </div>
              </div>
              <div className="glass-card p-5">
                <h4 className="mb-3 font-bold text-slate-900">{t("contact.payment")}</h4>
                <div className="flex flex-wrap gap-2">
                  {CLINIC_INFO.paymentMethods.slice(0, 8).map((method) => (
                    <span key={method} className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">{method}</span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">{t("contact.paymentMore")}</p>
              </div>
            </div>
          </div>

          <motion.div ref={ref} style={{ y }} className="glass-card-strong flex flex-col p-3">
            <div className="min-h-[320px] overflow-hidden rounded-2xl border border-violet-100 bg-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d626.4845822434345!2d114.00193244427605!3d4.4056281877301045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x321f4ff487d9e0c1%3A0x61cfeaf57dd5c196!2sPelita%20Clinic%20Miri!5e1!3m2!1sen!2smy!4v1775556073334!5m2!1sen!2smy"
                className="h-[320px] w-full border-0 md:h-full md:min-h-[420px]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t("contact.mapTitle")}
              />
            </div>
            <div className="p-6">
              <h4 className="mb-2 text-center text-xl font-bold text-slate-900">{t("contact.ctaTitle")}</h4>
              <p className="mb-5 text-center text-sm text-slate-600">{t("contact.ctaBody")}</p>
              <div className="flex flex-col gap-3">
                <a href={getWhatsAppLink(CLINIC_INFO.phone)} target="_blank" rel="noreferrer" className="btn-primary w-full">
                  {t("contact.whatsappCta")}
                </a>
                <a href={`tel:${CLINIC_INFO.phone}`} className="btn-secondary w-full">
                  {t("contact.callCta")}
                </a>
                <a href={`mailto:${CLINIC_INFO.email}`} className="rounded-full border border-violet-200 bg-white px-5 py-3 text-center text-sm font-semibold text-violet-700 transition hover:bg-violet-50">
                  {t("contact.emailCta")}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
