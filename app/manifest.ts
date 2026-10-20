import type { MetadataRoute } from "next";
import { copy, icon, site } from "@/config/site";
import { seo } from "@/config/seo";

/**
 * PWA manifest served at /manifest.webmanifest — generated from the active
 * event config, so swapping events also swaps the app name and icons.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.fullName,
    short_name: `${site.name} ${site.kicker}`,
    description: seo.ogDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: seo.lang,
    dir: "ltr",
    background_color: copy.theme.backgroundColor,
    theme_color: copy.theme.themeColor,
    categories: [...copy.seo.manifestCategories],
    icons: [
      { src: icon("android-chrome-192x192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: icon("android-chrome-512x512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: icon("android-chrome-512x512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
