import { useI18n } from "../../contexts/I18nContext";
import { FAQ_BY_LOCALE } from "../../locales/faqContent";
import { FaqCategoryCarousel } from "./FaqCategoryCarousel";

export default function FaqSection() {
  const { locale, t } = useI18n();
  const categories = FAQ_BY_LOCALE[locale];

  return (
    <section
      id="faq"
      className="section-shell border-t border-slate-200/70 bg-gradient-to-b from-slate-50/90 via-violet-50/20 to-white max-sm:!py-14"
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

        <div className="mx-auto min-w-0 max-w-3xl" role="region" aria-label={t("faq.listAria")}>
          {categories.length > 0 && (
            <FaqCategoryCarousel
              slides={categories}
              bundleLabel={t("faq.carouselBundle")}
              accent="violet"
              prevLabel={t("faq.carouselPrev")}
              nextLabel={t("faq.carouselNext")}
              dotLabel={(title) => t("faq.carouselDot", { title })}
              selectedSuffix={t("faq.carouselSelectedSuffix")}
              regionAria={t("faq.carouselRegion")}
            />
          )}
        </div>
      </div>
    </section>
  );
}
