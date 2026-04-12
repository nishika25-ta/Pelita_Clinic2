import { ChevronDown } from "lucide-react";
import { useI18n } from "../../contexts/I18nContext";
import { FAQ_BY_LOCALE } from "../../locales/faqContent";
import { cn } from "@/lib/utils";
import "./FaqSection.css";

export default function FaqSection() {
  const { locale, t } = useI18n();
  const categories = FAQ_BY_LOCALE[locale];

  return (
    <section
      id="faq"
      className="section-shell border-t border-slate-200/70 bg-gradient-to-b from-slate-50/90 via-white to-white max-sm:!py-14"
      aria-labelledby="faq-heading"
    >
      <div className="container-shell max-sm:px-3">
        <header className="mx-auto mb-10 max-w-3xl px-1 text-center sm:mb-14 sm:px-0">
          <p className="section-subtitle mb-2 sm:mb-3">{t("faq.section")}</p>
          <h2
            id="faq-heading"
            className="mb-3 text-balance text-2xl font-bold leading-[1.2] tracking-tight text-slate-900 sm:mb-4 sm:text-3xl md:text-4xl lg:text-[2.5rem]"
          >
            {t("faq.title")}
          </h2>
          <p className="text-[0.9375rem] leading-relaxed text-slate-600 sm:text-base md:text-lg md:leading-relaxed">
            {t("faq.subtitle")}
          </p>
        </header>

        <div
          className="mx-auto grid min-w-0 max-w-full grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-3 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-4"
          role="region"
          aria-label={t("faq.listAria")}
        >
          {categories.map((category, ci) => (
            <div key={category.title} className="contents">
              <div
                className={cn(
                  "col-span-full border-b border-slate-200/80 px-1 pb-3 sm:px-0",
                  ci === 0 ? "pt-0" : "pt-7 max-sm:pt-8 sm:pt-10",
                )}
              >
                <h3 className="text-balance break-words text-center text-sm font-bold uppercase tracking-[0.12em] text-slate-700 max-sm:leading-snug sm:tracking-[0.14em] md:text-base">
                  {category.title}
                </h3>
              </div>
              {category.items.map((item, ii) => (
                <div key={`${ci}-${ii}`} className="min-h-0 min-w-0">
                  <details className="faq-details h-full max-sm:rounded-xl max-sm:ring-0 sm:rounded-2xl sm:ring-1 sm:ring-slate-200/80 border-2 border-slate-300/95 bg-white shadow-[0_4px_16px_-4px_rgba(15,23,42,0.1),0_1px_0_0_rgba(255,255,255,1)_inset] transition-[border-color,box-shadow,background-color] hover:border-slate-400 hover:shadow-[0_8px_28px_-6px_rgba(15,23,42,0.14)] open:border-violet-500/85 open:bg-white open:shadow-[0_14px_40px_-12px_rgba(91,33,182,0.2),0_0_0_1px_rgba(139,92,246,0.15)] open:ring-violet-200/90 max-sm:active:scale-[0.99]">
                    <summary
                      className={cn(
                        "faq-summary touch-manipulation flex min-h-[3rem] cursor-pointer select-none items-start gap-2.5 rounded-2xl px-3 py-3.5 text-left max-sm:rounded-xl sm:min-h-[3.25rem] sm:gap-3 sm:px-5 sm:py-4",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400/80",
                        "max-sm:active:bg-slate-50/80",
                      )}
                    >
                      <span className="faq-icon-ring mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-300/90 bg-slate-100 text-slate-600 transition-colors duration-200 sm:h-10 sm:w-10">
                        <ChevronDown className="faq-chevron h-3.5 w-3.5 transition-transform duration-200 sm:h-4 sm:w-4 md:h-[1.125rem] md:w-[1.125rem]" strokeWidth={2.25} aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1 pt-0.5 text-pretty break-words text-[0.9375rem] font-medium leading-snug text-slate-900 sm:pt-1 sm:text-base md:text-[1.0625rem] md:leading-snug">
                        {item.q}
                      </span>
                    </summary>
                    <div className="border-t-2 border-slate-200/90 bg-slate-50/60 px-3 pb-3.5 pl-[2.65rem] pr-3 pt-2 max-sm:pl-[2.55rem] sm:px-5 sm:pb-5 sm:pl-[3.85rem] sm:pr-5">
                      <p className="text-pretty break-words text-[0.9375rem] leading-relaxed text-slate-600 sm:text-base md:text-[1.0625rem] md:leading-[1.65]">
                        {item.a}
                      </p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
