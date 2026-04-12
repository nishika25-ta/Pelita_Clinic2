import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { HeroHighlight, HeroHighlightId } from "../config/heroSectionContent";
import { HERO_HIGHLIGHTS } from "../config/heroSectionContent";
import { getNested } from "../locales/getNested";
import { localizeService } from "../locales/localizeService";
import type { Locale } from "../locales/types";
import { LOCALES } from "../locales/types";
import { UI_MESSAGES } from "../locales/uiMessages";
import type { ServiceItem } from "../types/clinic";

const STORAGE_KEY = "pelita-locale";

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const s = localStorage.getItem(STORAGE_KEY);
  if (s === "ms" || s === "zh" || s === "en") return s;
  return "en";
}

type I18nContextValue = {
  locale: Locale;
  locales: typeof LOCALES;
  setLocale: (l: Locale) => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
  getHeroHighlight: (id: HeroHighlightId) => HeroHighlight;
  localizeService: (service: ServiceItem) => { title: string; items: string[] };
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-Hans" : locale === "ms" ? "ms" : "en";
  }, [locale]);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>): string => {
      let raw: unknown = getNested(UI_MESSAGES[locale], path);
      if (typeof raw !== "string") raw = getNested(UI_MESSAGES.en, path);
      if (typeof raw !== "string") return path;
      let s = raw;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.split(`{{${k}}}`).join(String(v));
        }
      }
      return s;
    },
    [locale],
  );

  const getHeroHighlight = useCallback(
    (id: HeroHighlightId): HeroHighlight => {
      const base = HERO_HIGHLIGHTS.find((h) => h.id === id)!;
      const node = getNested(UI_MESSAGES[locale], `hero.highlights.${id}`) as
        | Partial<Record<keyof HeroHighlight, string>>
        | undefined;
      if (!node || typeof node !== "object") return base;
      return {
        id,
        category: typeof node.category === "string" ? node.category : base.category,
        title: typeof node.title === "string" ? node.title : base.title,
        description: typeof node.description === "string" ? node.description : base.description,
      };
    },
    [locale],
  );

  const locService = useCallback((service: ServiceItem) => localizeService(locale, service), [locale]);

  const value = useMemo(
    () => ({
      locale,
      locales: LOCALES,
      setLocale,
      t,
      getHeroHighlight,
      localizeService: locService,
    }),
    [locale, setLocale, t, getHeroHighlight, locService],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
