import type { ServiceItem } from "../types/clinic";
import type { Locale } from "./types";
import { serviceCategorySlug } from "./serviceCategorySlug";
import { SERVICES_MS } from "./servicesMs";
import { SERVICES_ZH } from "./servicesZh";

export function localizeService(locale: Locale, service: ServiceItem): { title: string; items: string[] } {
  if (locale === "en") return { title: service.category, items: service.items };
  const slug = serviceCategorySlug(service.category);
  const map = locale === "ms" ? SERVICES_MS : SERVICES_ZH;
  return map[slug] ?? { title: service.category, items: service.items };
}
