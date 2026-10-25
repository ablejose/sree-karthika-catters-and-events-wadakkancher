/** DERIVED — all SEO / schema.org values, generated from the event config. */
import { event } from "@/event.config";
import { templateCopy } from "@/config/template";
import { t } from "@/lib/copy";
import { brandAssets, icon, site } from "@/config/site";
import { services } from "@/config/services";
import { menu } from "@/config/menu";

const s = templateCopy.seo;
const e = event.seo ?? {};

export const seo = {
  title: e.title ?? t(s.title),
  titleTemplate: t(s.titleTemplate),
  description: e.description ?? t(s.description),
  ogDescription: e.ogDescription ?? e.description ?? t(s.ogDescription),
  // A site with its own SEO title uses only its own keywords (the template's are generic catering/events ones).
  keywords: e.title ? [...new Set(e.keywords ?? [])] : [...new Set([...(e.keywords ?? []), ...s.keywords.map(t)])],
  category: e.category ?? s.category,
  locale: s.locale,
  lang: s.lang,
  googleVerification: e.googleVerification ?? process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  bingVerification: e.bingVerification ?? process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
};

const abs = (p: string) => (p.startsWith("http") ? p : `${site.url}${p}`);
const veg = e.vegetarian === true;
const loc = event.location;

/**
 * schema.org @graph: the business, the website and the home page. Only facts from
 * the event config — no guessed opening hours, price range or payment methods.
 * "FoodEstablishment" is the valid schema.org type for a caterer.
 */
const business = {
  "@type": "FoodEstablishment",
  "@id": `${site.url}/#business`,
  name: site.fullName,
  alternateName: site.name,
  description: seo.description,
  slogan: site.tagline,
  url: site.url,
  logo: abs(icon("android-chrome-512x512.png")),
  image: [abs(brandAssets.ogImage)],
  telephone: site.phone,
  servesCuisine: e.cuisines ?? [...s.cuisines],
  ...(e.knowsAbout ? { knowsAbout: e.knowsAbout } : {}),
  address: {
    "@type": "PostalAddress",
    streetAddress: loc.street,
    addressLocality: loc.city,
    addressRegion: loc.region,
    postalCode: loc.postalCode,
    addressCountry: loc.country,
  },
  ...(loc.geo ? { geo: { "@type": "GeoCoordinates", latitude: loc.geo.lat, longitude: loc.geo.lng } } : {}),
  hasMap: site.mapsLink,
  areaServed: [
    ...new Set([loc.area, loc.city, loc.district].filter(Boolean)),
  ].map((name) => ({ "@type": "Place", name })).concat([{ "@type": "State", name: loc.region } as any]),
  sameAs: [event.web.instagram, event.web.facebook, event.web.youtube].filter(Boolean),
  ...(loc.opens && loc.closes
    ? { openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: loc.opens, closes: loc.closes } }
    : {}),
  ...(site.reviews
    ? { aggregateRating: { "@type": "AggregateRating", ratingValue: site.rating.toFixed(1), reviewCount: String(site.reviews) } }
    : {}),
  hasMenu: {
    "@type": "Menu",
    name: veg ? "Vegetarian sadhya menu" : "Menu",
    hasMenuSection: menu.map((c) => ({
      "@type": "MenuSection",
      name: c.title,
      hasMenuItem: c.items.map((i) => ({
        "@type": "MenuItem",
        name: i.name,
        ...(i.note ? { description: i.note } : {}),
        ...(veg || i.veg ? { suitableForDiet: "https://schema.org/VegetarianDiet" } : {}),
      })),
    })),
  },
  makesOffer: services.map((sv) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: sv.title, description: sv.blurb, areaServed: loc.city },
  })),
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    business,
    { "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: site.fullName, inLanguage: s.lang, publisher: { "@id": `${site.url}/#business` } },
    {
      "@type": "WebPage",
      "@id": `${site.url}/#webpage`,
      url: site.url,
      name: seo.title,
      description: seo.description,
      inLanguage: s.lang,
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": `${site.url}/#business` },
      primaryImageOfPage: { "@type": "ImageObject", url: abs(brandAssets.ogImage), width: 1200, height: 630 },
    },
  ],
};
