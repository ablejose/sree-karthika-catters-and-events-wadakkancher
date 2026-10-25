import type { EventConfig, EventImage, EventVariant, GalleryEntry, MenuCategory, MenuPreset, Story } from "@/config/event-schema";
import { templateMenu, templateMenuPresets, templateServices } from "@/config/template";

/**
 * ONE BUSINESS, AS THE SITE GENERATOR WRITES IT.
 *
 * `scripts/sitegen.mjs` turns each row of the business sheet (plus Google
 * Places data) into one of these and drops it in `events/active.json` before
 * building. Everything not listed here — hero, services, about, menu, copy —
 * comes from the template, so only their own details and their own photos
 * (gallery section only) change from site to site.
 */
export interface BusinessInput {
  slug: string;
  /** Full business name, cleaned (used for SEO + footer). */
  name: string;
  /** Big display word(s) for hero/header/loader. Falls back to `name`. */
  shortName?: string;
  /** Small line under the name, e.g. "Catering & Events". */
  descriptor?: string;
  /** What the business leads with — drives section copy. Defaults to "catering". */
  variant?: EventVariant;
  /** Their own hero line; without it every site shares the template's. "" hides it. */
  headline?: string;
  tagline?: string;
  /** Optional Malayalam line under the headline. */
  taglineMl?: string;

  address: string;
  street?: string;
  area?: string;
  city: string;
  district?: string;
  region?: string;
  postalCode?: string;
  geo?: { lat: number; lng: number };
  mapsLink: string;

  phone: string;
  /** wa.me digits, e.g. "919847348699". */
  whatsapp: string;
  email?: string;
  instagram?: string;
  facebook?: string;

  hours?: string;
  opens?: string;
  closes?: string;

  rating?: number;
  reviewCount?: number;
  /** Real Google reviews only. */
  reviews?: { name: string; rating: number; quote: string }[];

  /** Their own photos, relative to /events/<slug>/ — e.g. "gallery/01.jpg". */
  gallery: GalleryEntry[];

  /** Their own media, relative to /events/<slug>/. Anything left out stays template stock. */
  media?: {
    heroSlides?: EventImage[];
    about?: EventImage[];
    logoMark?: string;
    ogImage?: string;
    brandDir?: string;
    reel?: { src: string; poster: string; alt: string };
  };
  /** Their own photo for a shared service card, keyed by card id (config/template.ts). */
  serviceImages?: Record<string, string>;
  /** Towns for schema.org areaServed; defaults to city, area and district. */
  serviceAreas?: string[];
  /** One line shown in the footer instead of the service-area list, e.g. "Service across Kerala". */
  serviceNote?: string;
  /** Brand colours (hex). */
  theme?: { primary: string; accent: string };
  /** Their own menu for the quote builder; replaces the shared Kerala menu. */
  menu?: MenuCategory[];
  menuPresets?: MenuPreset[];
  /** Their own "what we do" cards (title, blurb, bullets, photo); replaces the shared three. */
  services?: { id: string; title: string; blurb: string; bullets: string[]; image?: string }[];
  /** Their own "how we work" steps. */
  process?: { n: string; title: string; text: string }[];
  /** Their own About paragraph ({tokens} work). */
  aboutBody?: string;
  /** "light" for a white, logo-led hero with no photos. */
  heroTone?: "image" | "light";
  heroRotate?: { words: string[]; after: string };
  /** Food story chapters after the hero; media paths relative to /events/<slug>/. */
  stories?: Story[];
  /** Loading screen background; "light" for a white loader. */
  loaderTone?: "dark" | "light";
  /** SEO overrides (title, description, keywords, cuisines, vegetarian…); see EventConfig.seo. */
  seo?: EventConfig["seo"];
  /** Credits for openly licensed photos (CC BY / BY-SA), listed in the footer. */
  photoCredits?: { text: string; href: string }[];

  /** Live site origin, no trailing slash. */
  url: string;
}

/** Template stock used for every generated site (public/template). */
const STOCK = {
  heroSlides: [
    { src: "/template/hero/03.webp", alt: "Banquet hall dressed in white and gold under crystal chandeliers" },
    { src: "/template/hero/01.webp", alt: "Floral wedding mandap with marigold garlands and gold chairs" },
  ],
  about: [
    { src: "/template/placeholders/02.webp", alt: "Wedding buffet spread with gold chafing dishes and florals" },
    { src: "/template/about-fallback.webp", alt: "Bride under fairy lights at an evening celebration" },
  ],
  ogImage: "/template/og-image.jpg",
  brandDir: "/template/brand",
};

/**
 * Generated sites serve businesses of every community, so the shared menu
 * drops dishes not every caterer offers and uses a neutral preset name.
 */
const NEUTRAL_DROP = new Set(["pork-ularthiyathu"]);
const neutralMenu = templateMenu.map((c) => ({ ...c, items: c.items.filter((i) => !NEUTRAL_DROP.has(i.id)) }));
const neutralPresets: MenuPreset[] = templateMenuPresets.map((p) => ({
  ...p,
  title: p.title === "Christian Wedding Feast" ? "Kerala Wedding Feast" : p.title,
  items: p.items.filter((id) => !NEUTRAL_DROP.has(id)),
}));

const uniq = (xs: (string | undefined)[]) => Array.from(new Set(xs.filter((x): x is string => !!x && !!x.trim())));

export function fromBusiness(b: BusinessInput): EventConfig {
  // Unknown district, or district == town (e.g. Kottayam): show the state instead of repeating the town.
  const district = b.district && b.district.toLowerCase() !== b.city.toLowerCase() ? b.district : b.region || "Kerala";
  const descriptor = b.descriptor || "Catering & Events";
  const mapEmbed = b.geo
    ? `https://www.google.com/maps?q=${b.geo.lat},${b.geo.lng}&z=15&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(`${b.name}, ${b.address}`)}&output=embed`;

  return {
    slug: b.slug,
    variant: b.variant ?? "catering",
    brand: {
      name: b.shortName || b.name,
      fullName: b.name,
      descriptor,
      kicker: descriptor,
      tagline: b.tagline || "Weddings & events, catered with care.",
      headline: b.headline ?? "Unforgettable feasts. Flawless celebrations.",
      taglineMl: b.taglineMl,
    },
    contact: { phone: b.phone, whatsapp: b.whatsapp, email: b.email || undefined },
    location: {
      city: b.city,
      district,
      region: b.region || "Kerala",
      area: b.area || undefined,
      address: b.address,
      street: b.street || b.area || b.city,
      postalCode: b.postalCode || "",
      country: "IN",
      serviceAreas: b.serviceAreas ?? uniq([b.city, b.area, district]),
      serviceNote: b.serviceNote,
      geo: b.geo,
      mapsLink: b.mapsLink,
      mapEmbed,
      hours: b.hours || "Call or WhatsApp to book",
      opens: b.opens,
      closes: b.closes,
      delivery: false,
    },
    web: { url: b.url, instagram: b.instagram || undefined, facebook: b.facebook || undefined },
    reputation: { rating: b.rating ?? 0, reviews: b.reviewCount ?? 0 },
    theme: b.theme,
    media: {
      base: `/events/${b.slug}`,
      heroPoster: (b.media?.heroSlides ?? STOCK.heroSlides)[0].src,
      heroSlides: b.media?.heroSlides ?? STOCK.heroSlides,
      logoMark: b.media?.logoMark,
      ogImage: b.media?.ogImage ?? STOCK.ogImage,
      brandDir: b.media?.brandDir ?? STOCK.brandDir,
      about: b.media?.about ?? STOCK.about,
      gallery: b.gallery.map((g, i) => {
        const alt = `${b.name} — event photo ${i + 1}`;
        return typeof g === "string" ? { src: g, alt } : { ...g, alt: g.alt ?? alt };
      }),
      reel: b.media?.reel,
    },
    reviews: (b.reviews ?? []).map((r) => ({ ...r, source: "Google review" })),
    seo: { ...b.seo, keywords: uniq([...(b.seo?.keywords ?? []), b.name, b.shortName, `${b.shortName || b.name} ${b.city}`]) },
    photoCredits: b.photoCredits,
    loaderTone: b.loaderTone,
    heroTone: b.heroTone,
    heroRotate: b.heroRotate,
    stories: b.stories,
    overrides: {
      menu: b.menu ?? neutralMenu,
      menuPresets: b.menu ? (b.menuPresets ?? []) : neutralPresets,
      services:
        b.services ??
        (b.serviceImages
          ? templateServices.map((s) => ({ ...s, bullets: [...s.bullets], image: b.serviceImages?.[s.id] ?? s.image }))
          : undefined),
      process: b.process,
      aboutBody: b.aboutBody,
    },
  };
}
