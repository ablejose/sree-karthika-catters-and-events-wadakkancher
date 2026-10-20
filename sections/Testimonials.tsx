import { Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import { copy, site } from "@/config/site";
import { reviews } from "@/config/reviews";
import { t } from "@/lib/copy";

/**
 * SOCIAL PROOF — real reviews only, supplied per event in
 * events/<slug>.config.ts. Never add invented testimonials or fake names.
 * Renders nothing when an event has no reviews yet.
 */
function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Testimonials() {
  if (reviews.length === 0) return null;
  const [lead, ...others] = reviews;
  // Keep the right-hand grid even so no card sits alone on the last row.
  const rest = others.length > 1 ? others.slice(0, others.length - (others.length % 2)) : others;

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="relative overflow-hidden bg-espresso py-16 text-ivory md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(196,137,46,0.16), rgba(196,137,46,0))" }}
      />
      <div className="relative mx-auto max-w-shell px-6">
        <Reveal className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow" style={{ color: "var(--saffron)" }}>
              {copy.testimonials.eyebrow}
            </p>
            <h2 id="testimonials-heading" className="display mt-4 text-ivory" style={{ fontSize: "clamp(2rem, 3.8vw, 3.2rem)", color: "#fff" }}>
              {copy.testimonials.heading}
            </h2>
          </div>
          <a
            href={site.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-brand border border-ivory/15 bg-ivory/5 px-5 py-4 transition-colors hover:border-saffron/60"
          >
            <span className="font-display text-5xl leading-none text-saffron">{site.rating.toFixed(1)}</span>
            <span>
              <span className="flex gap-0.5" aria-label={`${site.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={15} className="fill-saffron text-saffron" />
                ))}
              </span>
              <span className="mt-1 block font-sans text-xs text-ivory/70">{t(copy.testimonials.ratingLink)}</span>
            </span>
          </a>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Lead review, set large */}
          <Reveal className="lg:col-span-1 lg:row-span-2">
            <figure className="flex h-full flex-col justify-between rounded-brand border border-saffron/30 bg-gradient-to-b from-ivory/[0.07] to-ivory/[0.02] p-7 md:p-9">
              <div>
                <span className="font-display text-7xl leading-none text-saffron/80" aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="display -mt-4 italic text-ivory" style={{ fontSize: "clamp(1.15rem, 1.7vw, 1.4rem)", lineHeight: 1.5, fontWeight: 400, color: "#fff" }}>
                  {lead.quote}
                </blockquote>
              </div>
              <Byline r={lead} />
            </figure>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
            {rest.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.06} className="h-full">
                <figure className="flex h-full flex-col rounded-brand border border-ivory/10 bg-ivory/[0.04] p-6 transition-colors hover:border-ivory/25">
                  <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <Star key={s} size={14} className="fill-saffron text-saffron" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 font-sans text-[0.92rem] font-light leading-relaxed text-ivory/85">&ldquo;{r.quote}&rdquo;</blockquote>
                  <Byline r={r} />
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Byline({ r }: { r: (typeof reviews)[number] }) {
  return (
    <figcaption className="mt-6 flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-saffron/15 font-display text-sm text-saffron">{initials(r.name)}</span>
      <span className="leading-tight">
        <span className="block font-sans text-sm font-semibold text-ivory">{r.name}</span>
        <span className="block font-sans text-xs text-ivory/50">{r.source ?? copy.testimonials.sourceLabel}</span>
      </span>
    </figcaption>
  );
}
