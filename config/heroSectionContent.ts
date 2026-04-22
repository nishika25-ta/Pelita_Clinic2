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

/** Hero carousel poster images — files live in `public/poster_hero/` (e.g. `public/poster_hero/Senior_L.jpeg` → `/poster_hero/Senior_L.jpeg`). */
export interface HeroPosterSlide {
  id: string;
  /** Sort order in carousel; lower number shows earlier. */
  order: number;
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
    order: 10,
    src: "/poster_hero/Senior_L.jpeg",
    srcMobile: "/poster_hero/Senior_P.jpeg",
    alt: "",
  },
  {
    id: "poster-vaccine",
    order: 20,
    src: "/poster_hero/Vaccine_L.jpeg",
    srcMobile: "/poster_hero/Vaccine_P.jpeg",
    alt: "",
  },
  {
    id: "poster-berikel",
    order: 90,
    src: "/poster_hero/Berikel_L.jpeg",
    srcMobile: "/poster_hero/Berikel_P.jpeg",
    alt: "",
  },
  {
    id: "poster-hs1",
    order: 30,
    src: "/poster_hero/new/HS1_L.png",
    srcMobile: "/poster_hero/new/HS1_P.png",
    alt: "",
  },
  {
    id: "poster-hs2",
    order: 40,
    src: "/poster_hero/new/HS2_L.png",
    srcMobile: "/poster_hero/new/HS2_P.png",
    alt: "",
  },
  {
    id: "poster-hiv",
    order: 50,
    src: "/poster_hero/new/hiv_L.png",
    srcMobile: "/poster_hero/new/hiv_P.jpeg",
    alt: "",
  },
  {
    id: "poster-preg",
    order: 60,
    src: "/poster_hero/new/preg_L.png",
    srcMobile: "/poster_hero/new/preg_P.png",
    alt: "",
  },
  {
    id: "poster-labour",
    order: 70,
    src: "/poster_hero/new/labour_L.jpeg",
    srcMobile: "/poster_hero/new/labour_P.jpeg",
    alt: "",
  },
  {
    id: "poster-give",
    order: 90,
    src: "/poster_hero/new/give_L.jpeg",
    srcMobile: "/poster_hero/new/give_P.jpeg",
    alt: "",
  },
  {
    id: "poster-new-post-1",
    order: 25,
    src: "/new_post/land1.png",
    srcMobile: "/new_post/pot1.png",
    alt: "",
  },
  {
    id: "poster-new-post-2",
    order: 26,
    src: "/new_post/land2.png",
    srcMobile: "/new_post/pot2.png",
    alt: "",
  },
] as const;

export function getOrderedHeroPosters(posters: readonly HeroPosterSlide[]): HeroPosterSlide[] {
  return [...posters].sort((a, b) => a.order - b.order);
}
