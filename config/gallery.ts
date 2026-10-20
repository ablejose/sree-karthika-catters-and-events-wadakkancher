/** DERIVED — the client's own photos/videos, resolved against media.base. */
import { event } from "@/event.config";
import { templateCopy } from "@/config/template";
import { asset } from "@/lib/copy";
import type { GalleryEntry } from "@/config/event-schema";

export interface GalleryItem {
  src: string;
  alt: string;
  /** Shown under the photo in the Gallery section when set. */
  caption?: string;
  wide?: boolean;
}

const normalize = (entry: GalleryEntry, fallbackAlt: string): GalleryItem => {
  if (typeof entry === "string") {
    return { src: asset(entry), alt: fallbackAlt };
  }
  return {
    src: asset(entry.src),
    alt: entry.alt ?? entry.caption ?? fallbackAlt,
    caption: entry.caption,
  };
};

/** OUR WORK — images. Personal event photos only (public/events/<slug>/...). */
export const galleryImages: GalleryItem[] = event.media.gallery.map((g, i) =>
  normalize(g, `${event.brand.name} — photo ${i + 1}`)
);

/** About-section crossfade pair. */
export const aboutImages: GalleryItem[] = event.media.about.map((a, i) =>
  normalize(a, `${event.brand.name} — photo ${i + 1}`)
);

export const gallerySettings = templateCopy.gallerySettings;
