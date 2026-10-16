import { event } from "@/event.config";

/**
 * Fills {tokens} in template copy from the active event config, so shared
 * strings in config/template.ts stay event-agnostic.
 */
const tokens: Record<string, string> = {
  brand: event.brand.name,
  fullName: event.brand.fullName,
  descriptor: event.brand.descriptor,
  kicker: event.brand.kicker,
  tagline: event.brand.tagline,
  city: event.location.city,
  district: event.location.district,
  region: event.location.region,
  area: event.location.area ?? event.location.city,
  // "Kotheri, Mattannur" when there is a distinct area, else "Mattannur, Kannur" — never the town twice.
  place:
    event.location.area && event.location.area !== event.location.city
      ? `${event.location.area}, ${event.location.city}`
      : `${event.location.city}, ${event.location.district}`,
  serving: event.location.serviceNote ?? `Serving ${event.location.city} & ${event.location.district}`,
  address: event.location.address,
  phone: event.contact.phone,
  hours: event.location.hours,
  areas: event.location.serviceAreas.join(" · "),
  rating: event.reputation.rating.toFixed(1),
  reviews: String(event.reputation.reviews),
};

/** t("Serving {city} & {district}") -> "Serving Perintalmanna & Malappuram" */
export const t = (s: string): string => s.replace(/\{(\w+)\}/g, (m, k) => tokens[k] ?? m);

/** Fill a list of template strings. */
export const tAll = (list: readonly string[]): string[] => list.map(t);

/**
 * Resolves a media path from the event config. Relative paths hang off
 * media.base, so a whole event's assets move by changing one line.
 */
export const asset = (path: string): string => {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) return path;
  return `${event.media.base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};
