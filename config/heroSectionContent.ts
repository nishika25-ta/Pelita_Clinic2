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
  src: string;
  alt: string;
}

export const HERO_POSTERS: readonly HeroPosterSlide[] = [
  {
    id: "poster-prep",
    src: "/poster1.jpeg",
    alt: "Pelita Clinic poster: HIV PrEP availability, pricing, and included services.",
  },
  {
    id: "poster-labour-day",
    src: "/poster2.jpeg",
    alt: "Pelita Clinic poster: Labour Day closure and reopening dates.",
  },
  {
    id: "poster-health-screening",
    src: "/poster3.jpeg",
    alt: "Pelita Clinic poster: health screening packages and add-on offers.",
  },
] as const;
