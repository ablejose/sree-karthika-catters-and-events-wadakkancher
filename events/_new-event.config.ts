import type { EventConfig } from "@/config/event-schema";

/**
 * STARTER — copy this file to events/<slug>.config.ts, fill it in, then point
 * event.config.ts at it. Put the client's own photos/videos in
 * public/events/<slug>/ and keep every path below relative to that folder.
 *
 * Only put PERSONAL data here: name, phone, address, maps, socials, their real
 * reviews, their own media. Shared copy ("what we do", "how we work", headings)
 * already lives in config/template.ts — do not repeat it per event.
 */
export const newEvent: EventConfig = {
  slug: "new-event",

  // Optional. Picks the section order + copy set: "catering" (default) puts
  // menu/services and the food gallery first; "events" leads with services,
  // decor and stages; "wedding" leads with the planning process and venues.
  // Leave unset to use "catering".
  // variant: "catering",

  brand: {
    name: "Brand",
    fullName: "Brand Catering & Event Management",
    descriptor: "Catering & Event Management",
    kicker: "Catering & Events",
    tagline: "Weddings & events, catered with care.",
    // Optional. Local hero headline shown under the name. Falls back to `tagline` when unset.
    // headline: "Weddings and functions, styled beautifully.",
    // Optional. A short Malayalam line shown under the headline/tagline in the hero.
    // taglineMl: "ഒരുക്കങ്ങൾ ഭംഗിയായി.",
  },

  contact: {
    phone: "+91 00000 00000",
    whatsapp: "910000000000", // digits only, with country code
  },

  location: {
    city: "Town",
    district: "District",
    region: "Kerala",
    area: "Locality",
    address: "Landmark, Locality, Town, District, Kerala 000000",
    street: "Landmark, Locality",
    postalCode: "000000",
    country: "IN",
    serviceAreas: ["Town", "Nearby town", "Another town"],
    geo: { lat: 0, lng: 0 },
    mapsLink: "https://maps.google.com/?q=0,0",
    mapEmbed: "https://www.google.com/maps?q=0,0&z=15&output=embed",
    hours: "Open 24 hours · all days",
    opens: "00:00",
    closes: "23:59",
    delivery: true,
  },

  web: {
    url: "https://www.example.in",
    instagram: "", // leave blank to hide the Instagram section + footer icon
    facebook: "", // leave blank to hide the Facebook footer icon
  },

  reputation: { rating: 5.0, reviews: 0 },

  // Optional. Brand colours applied as CSS variables (buttons, accents,
  // headings). Omit to keep the template's default gold palette.
  // theme: { primary: "#C4892E", accent: "#A9721F" },

  // Optional. Short cards for the lightweight "at a glance" services grid.
  // Independent of `overrides.services` below. Leave unset/empty to hide it.
  // services: [{ title: "Live counters", note: "Chaat and dessert counters cooked to order." }],

  // Optional. Short chips rendered near the hero. Leave unset/empty to hide them.
  // highlights: ["Multi-cuisine menus", "In-house décor team"],

  media: {
    base: "/events/new-event",
    heroPoster: "hero-poster.webp",
    ogImage: "og-image.jpg",
    brandDir: "brand",
    about: [
      { src: "about-1.webp", alt: "Describe the photo" },
      { src: "about-2.webp", alt: "Describe the photo" },
    ],
    // Gallery entries accept a plain path/URL string (alt is generated), or an
    // object with an optional `alt` and an optional `caption` shown under the photo.
    gallery: [{ src: "gallery/01.webp", alt: "Describe the photo", caption: "Describe the photo" }],
  },

  // Real reviews only. Leave [] until you have them — the section hides itself.
  reviews: [],

  seo: { keywords: [] },

  // Optional. Only when this client genuinely differs from the template.
  // overrides: { services: [...], process: [...], aboutBody: "..." },
};
