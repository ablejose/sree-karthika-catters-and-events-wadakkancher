import { site } from "@/config/site";
import { seo } from "@/config/seo";
import { services } from "@/config/services";
import { menu } from "@/config/menu";

/**
 * /llms.txt — a plain-text summary of the business for AI assistants and
 * answer engines (llmstxt.org). Built from the same event config as the page.
 */
export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${site.fullName}`,
    "",
    `> ${seo.description}`,
    "",
    `- Website: ${site.url}/`,
    `- Address: ${site.address}`,
    `- Phone: ${[site.phone, ...site.phonesAlt].join(", ")}`,
    `- WhatsApp: https://wa.me/${site.whatsapp}`,
    ...(site.email ? [`- Email: ${site.email}`] : []),
    `- Service area: ${site.serviceNote ?? site.serviceAreas.join(", ")}`,
    ...(site.reviews ? [`- Google rating: ${site.rating.toFixed(1)} from ${site.reviews} reviews`] : []),
    `- Google Maps: ${site.mapsLink}`,
    ...(site.instagram ? [`- Instagram: ${site.instagram}`] : []),
    "",
    "## Services",
    "",
    ...services.map((s) => `- ${s.title}: ${s.blurb}`),
    "",
    "## Menu",
    "",
    ...menu.map((c) => `- ${c.title}: ${c.items.map((i) => i.name).join(", ")}`),
    "",
    "## Pages",
    "",
    `- [Home](${site.url}/): our sadhya story, services, photos, menu and contact`,
    `- [Sitemap](${site.url}/sitemap.xml)`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
