import Reveal from "@/components/Reveal";
import { copy, site } from "@/config/site";

/**
 * AT A GLANCE — lightweight services grid driven by `event.services`
 * (config/event-schema.ts). Independent of the main "What we do" section
 * (sections/Services.tsx + config/services.ts). Hidden entirely when the
 * event sets no `services`.
 */
export default function QuickServices() {
  const items = site.quickServices;
  if (items.length === 0) return null;

  return (
    <section id="quick-services" aria-labelledby="quick-services-heading" className="bg-cream py-10 md:py-14">
      <div className="mx-auto max-w-shell px-6">
        <Reveal>
          <p className="eyebrow">{copy.quickServices.eyebrow}</p>
          <h2 id="quick-services-heading" className="display mt-3" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)" }}>
            {copy.quickServices.heading}
          </h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={`${s.title}-${i}`} delay={i * 0.05}>
              <div className="h-full rounded-brand border border-sand bg-white p-5">
                <p className="font-display text-lg text-espresso">{s.title}</p>
                {s.note && <p className="mt-1.5 font-sans text-sm text-muted">{s.note}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
