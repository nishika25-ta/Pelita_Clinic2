import { useI18n } from "../../contexts/I18nContext";
import type { Locale } from "../../locales/types";

export default function LanguageSwitcher() {
  const { locale, setLocale, locales, t } = useI18n();

  return (
    <div
      className="fixed left-[max(0.75rem,env(safe-area-inset-left))] top-[max(0.75rem,env(safe-area-inset-top))] z-[110] flex items-center gap-0.5 rounded-full border border-violet-200/80 bg-white/90 p-1 shadow-lg shadow-violet-200/30 backdrop-blur-md touch-manipulation"
      role="group"
      aria-label={t("langSwitcherAria")}
    >
      {locales.map((L) => (
        <button
          key={L.id}
          type="button"
          onClick={() => setLocale(L.id)}
          className={`touch-manipulation rounded-full px-2.5 py-1.5 text-xs font-semibold transition max-sm:min-h-[2.75rem] max-sm:min-w-[2.625rem] max-sm:px-3 max-sm:py-2 sm:px-3 sm:text-sm ${
            locale === L.id
              ? "bg-violet-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-violet-50 hover:text-violet-800"
          }`}
          aria-pressed={locale === L.id}
        >
          {L.id === "en" ? "EN" : L.id === "ms" ? "BM" : "中文"}
        </button>
      ))}
    </div>
  );
}
