import Hero from "@/sections/Hero";
import TrustBar from "@/sections/TrustBar";
import QuickServices from "@/sections/QuickServices";
import Services from "@/sections/Services";
import Gallery from "@/sections/Gallery";
import Process from "@/sections/Process";
import About from "@/sections/About";
import Testimonials from "@/sections/Testimonials";
import Menu from "@/sections/Menu";
import Footer from "@/sections/Footer";
import { variant } from "@/config/site";

/**
 * Page order follows the AIDA conversion journey — hero, proof, offer, reviews,
 * then the menu quote builder as the close and the visit/map footer — but the middle block
 * (Services / Gallery / Process / About) reorders per `event.variant`
 * (config/event-schema.ts) so the lead offer matches the business:
 *
 *   catering (default) -> services, food gallery first, then process + about.
 *   events             -> services (decor/stages), gallery, then process + about.
 *   wedding            -> planning process + venues (about) first, then services + gallery.
 */
const MIDDLE_ORDER: Record<string, readonly ["services" | "gallery" | "process" | "about", ...("services" | "gallery" | "process" | "about")[]]> = {
  catering: ["services", "gallery", "process", "about"],
  events: ["services", "gallery", "process", "about"],
  wedding: ["process", "about", "services", "gallery"],
};

const SECTION_BY_KEY = {
  services: Services,
  gallery: Gallery,
  process: Process,
  about: About,
} as const;

export default function HomePage() {
  const order = MIDDLE_ORDER[variant] ?? MIDDLE_ORDER.catering;

  return (
    <main>
      <Hero />
      <TrustBar />
      <QuickServices />
      {order.map((key) => {
        const Section = SECTION_BY_KEY[key];
        return <Section key={key} />;
      })}
      <Testimonials />
      <Menu />
      <Footer />
    </main>
  );
}
