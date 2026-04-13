/**
 * Static hero marketing copy — edit here instead of inside the component.
 * Icons are mapped by `id` in `HeroSection.tsx`.
 */
export type HeroHighlightId = "promotions" | "news" | "hiring";

export interface HeroHighlight {
  id: HeroHighlightId;
  category: string;
  title: string;
  description: string;
}

export const HERO_HIGHLIGHTS: readonly HeroHighlight[] = [
  {
    id: "promotions",
    category: "Promotions",
    title: "Screening & seasonal offers",
    description:
      "Limited-time bundles on family health screens, travel vaccines, and seasonal check-ups—ask reception or WhatsApp for what’s running now.",
  },
  {
    id: "news",
    category: "News",
    title: "Inside the practice",
    description:
      "New services, equipment, and quality initiatives—short notes on how we’re raising the bar for care in Miri.",
  },
  {
    id: "hiring",
    category: "Hiring",
    title: "Grow with Pelita",
    description:
      "We’re looking for warm, reliable front-desk and clinical support staff. CVs and enquiries welcome via WhatsApp.",
  },
] as const;

/** Hero carousel poster images — files live in `public/` (e.g. `public/poster1.jpeg` → `/poster1.jpeg`). */
export interface HeroPosterSlide {
  id: string;
  /** Landscape / desktop (default `<img src>` and `<picture>` fallback). */
  src: string;
  /** Portrait / narrow viewports — used with `<source media="(max-width: 767px)">` when set. */
  srcMobile?: string;
  /** Fallback description; carousel uses `hero.posters.<id>.alt` from i18n when available. */
  alt: string;
}

export const HERO_POSTERS: readonly HeroPosterSlide[] = [
  {
    id: "poster-senior",
    src: "/Senior_L.jpeg",
    srcMobile: "/Senior_P.jpeg",
    alt: "",
  },
  {
    id: "poster-vaccine",
    src: "/Vaccine_L.jpeg",
    srcMobile: "/Vaccine_P.jpeg",
    alt: "",
  },
  {
    id: "poster-berikel",
    src: "/Berikel_L.jpeg",
    srcMobile: "/Berikel_P.jpeg",
    alt: "",
  },
] as const;
