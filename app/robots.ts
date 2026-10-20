import type { MetadataRoute } from "next";
import { site } from "@/config/site";

/**
 * robots.txt served at /robots.txt. Allows all crawlers and points them at the
 * sitemap so Google can discover every page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
