import { motion } from "framer-motion";
import { useI18n } from "../../contexts/I18nContext";
import { PANELS } from "../../config/clinicData";
import { useParallax } from "../../utils/useParallax";

const PANEL_ICON_MAP: Record<string, string> = {
  AIA: "/panel_icon/AIA.png",
  "EMAS (Eximius)": "/panel_icon/eximius.png",
  PERKESO: "/panel_icon/PERKESO.png",
  "Health Connect / MediExpress": "/panel_icon/mediexpress.png",
  "PeKa B40": "/panel_icon/PEKA.png",
  PMCare: "/panel_icon/pmcare.png",
  "Senior Citizen Health Benefit (SCHB)": "/panel_icon/SCHB.jpg",
  "Kenyalang Gold Card": "/panel_icon/GoldCard.png",
  WeCare: "/panel_icon/wecare.png",
  Medkad: "/panel_icon/medkad.png",
  "Great Eastern": "/panel_icon/greateastern.png",
  "Public Bank": "/panel_icon/publicbank.png",
  "Grand Palace Hotel Miri": "/panel_icon/grandpalace.png",
  SAFHIS: "/panel_icon/SFH.jpeg",
};

export default function PanelsSection() {
  const { t } = useI18n();
  const decor = useParallax({ distance: 44 });

  return (
    <section id="panels" className="section-shell relative overflow-hidden pt-8" aria-labelledby="panels-heading">
      <motion.div
        ref={decor.ref}
        style={{ y: decor.y }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-violet-300/25 blur-3xl" />
        <div className="absolute -left-16 bottom-32 h-64 w-64 rounded-full bg-cyan-200/20 blur-3xl" />
      </motion.div>
      <div className="container-shell relative z-10">
        <div className="glass-card-strong overflow-hidden border border-violet-300/50 bg-white/90 p-8 shadow-[0_20px_50px_-18px_rgba(91,33,182,0.18)] ring-1 ring-violet-200/40 sm:p-10">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h3 id="panels-heading" className="mb-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {t("panels.heading")}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">{t("panels.body")}</p>
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4" role="list">
            {PANELS.map((panel) => (
              <li key={panel} className="list-none">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-violet-300/70 bg-gradient-to-b from-white via-violet-50/40 to-violet-100/50 shadow-[0_10px_28px_-8px_rgba(15,23,42,0.12),0_2px_0_0_rgba(255,255,255,0.85)_inset] ring-1 ring-slate-300/35 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-[0_16px_36px_-10px_rgba(91,33,182,0.22)] focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-400 focus-within:ring-offset-2 focus-within:ring-offset-violet-50/80">
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-violet-200/80 bg-slate-100">
                    <div
                      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.12),transparent_55%)]"
                      aria-hidden
                    />
                    {PANEL_ICON_MAP[panel] ? (
                      <img
                        src={PANEL_ICON_MAP[panel]}
                        alt={`${panel} logo`}
                        className="relative z-[1] box-border h-full w-full object-contain object-center p-3 transition duration-300 group-hover:scale-[1.02] sm:p-4"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="relative z-[1] flex h-full w-full items-center justify-center px-3">
                        <span className="text-center text-xs font-semibold uppercase tracking-wider text-violet-600">
                          {panel}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-end border-t border-violet-200/70 bg-violet-50/90 px-4 py-3.5">
                    <p className="text-sm font-semibold leading-snug text-slate-900">{panel}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
