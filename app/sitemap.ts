import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * XML sitemap served at /sitemap.xml.
 * Single-page site: the homepage is the only indexable URL (the nav items are
 * in-page anchors, not separate routes). Submit https://<domain>/sitemap.xml
 * in Google Search Console.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
