import { useMemo } from "react";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "../../contexts/I18nContext";
import { CLINIC_INFO } from "../../config/clinicData";
import { getWhatsAppLink } from "../../utils/contact";

const linkClass =
  "rounded-md px-2 py-1 text-slate-600 transition hover:bg-violet-50 hover:text-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-violet-500";

const contactClass =
  "inline-flex max-w-full items-center gap-2 rounded-lg px-2 py-1 text-xs text-slate-600 transition hover:bg-white/80 hover:text-violet-800";

export default function SiteFooter() {
  const { t } = useI18n();
  const whatsappUrl = getWhatsAppLink(CLINIC_INFO.phone);
  const currentYear = new Date().getFullYear();

  const NAV_LINKS = useMemo(
    () => [
      { label: t("footer.navHome"), href: "#home" },
      { label: t("footer.navServices"), href: "#services" },
      { label: t("footer.navPanels"), href: "#panels" },
      { label: t("footer.navDoctor"), href: "#profile" },
      { label: t("footer.navReviews"), href: "#reviews" },
      { label: t("footer.navContact"), href: "#contact" },
      { label: t("footer.navFaq"), href: "#faq" },
    ],
    [t],
  );

  return (
    <footer className="border-t border-slate-200/80 bg-gradient-to-b from-slate-50/95 via-white to-violet-50/30">
      <div className="container-shell py-8 sm:py-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:gap-3.5">
            <img
              src="/logo/logo.png"
              alt={`${CLINIC_INFO.name} logo`}
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-lg border border-slate-200/80 bg-white object-cover shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold tracking-tight text-slate-900">{CLINIC_INFO.name}</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-violet-600/90">
                {t("footer.tagline")}
              </p>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500">{t("footer.blurb")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:gap-8 lg:flex-nowrap lg:justify-end">
            <nav className="min-w-0" aria-label={t("footer.labelSite")}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{t("footer.labelSite")}</p>
              <ul className="flex flex-wrap gap-x-1 gap-y-0.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="min-w-0 sm:min-w-[12rem]">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{t("footer.labelContact")}</p>
              <ul className="flex flex-col gap-0.5">
                <li>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className={contactClass}>
                    <Phone className="h-3.5 w-3.5 shrink-0 text-violet-500" strokeWidth={2} aria-hidden />
                    <span className="truncate font-medium">{CLINIC_INFO.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CLINIC_INFO.email}`} className={contactClass}>
                    <Mail className="h-3.5 w-3.5 shrink-0 text-violet-500" strokeWidth={2} aria-hidden />
                    <span className="truncate">{CLINIC_INFO.email}</span>
                  </a>
                </li>
                <li>
                  <a href={CLINIC_INFO.mapsLink} target="_blank" rel="noreferrer" className={contactClass}>
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-violet-500" strokeWidth={2} aria-hidden />
                    <span className="inline-flex min-w-0 items-center gap-1 truncate">
                      {CLINIC_INFO.area}
                      <ExternalLink className="h-3 w-3 shrink-0 opacity-50" aria-hidden />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200/70 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-[11px] text-slate-400">
            © {currentYear} {CLINIC_INFO.name}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-500/90">
            {t("footer.scribear")}
            <span className="mx-1.5 text-slate-300">·</span>
            {t("footer.codedBy")}{" "}
            <a
              href="https://scribear.my/"
              className="text-violet-700 underline decoration-violet-300/80 underline-offset-2 transition hover:text-violet-900 hover:decoration-violet-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Scribear
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
