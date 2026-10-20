import { Phone, MapPin, Clock, Instagram, Facebook, Mail, Navigation } from "lucide-react";
import Reveal from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { copy, logoMark, site, telLink, waLink } from "@/config/site";
import { t } from "@/lib/copy";

const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;

export default function Footer() {
  const year = new Date().getFullYear();
  const v = copy.visit;

  return (
    <footer id="contact" className="bg-espresso text-ivory">
      {/* VISIT — the last stop: every way to reach them, plus the map. */}
      <div className="mx-auto max-w-shell px-6 pb-14 pt-16 md:pt-24">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <p className="eyebrow" style={{ color: "var(--saffron)" }}>
              {v.eyebrow}
            </p>
            <h2 className="display mt-4" style={{ fontSize: "clamp(2rem, 3.8vw, 3.2rem)", color: "#fff" }}>
              {v.heading}
            </h2>
            <p className="mt-4 max-w-md font-sans text-[0.95rem] font-light leading-relaxed text-ivory/70">{t(v.body)}</p>

            <ul className="mt-8 space-y-4 font-sans text-sm text-ivory/85">
              <li className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-saffron" />
                {site.address}
              </li>
              <li className="flex items-start gap-3">
                <Phone size={17} className="mt-0.5 shrink-0 text-saffron" />
                <span className="flex flex-wrap gap-x-4 gap-y-1">
                  <a href={telLink} className="link-underline">{site.phone}</a>
                  {site.phoneAlt && <a href={tel(site.phoneAlt)} className="link-underline">{site.phoneAlt}</a>}
                </span>
              </li>
              {site.email && (
                <li className="flex items-center gap-3">
                  <Mail size={17} className="shrink-0 text-saffron" />
                  <a href={`mailto:${site.email}`} className="link-underline break-all">{site.email}</a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Clock size={17} className="shrink-0 text-saffron" />
                {site.hours}
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-sans text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
              >
                <WhatsAppIcon size={17} /> {copy.cta.whatsapp}
              </a>
              <a
                href={site.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-ivory/30 px-6 py-3.5 font-sans text-sm font-medium text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:border-saffron hover:text-saffron"
              >
                <Navigation size={16} /> {v.directions}
              </a>
            </div>
          </Reveal>

          {site.mapEmbed && (
            // Not wrapped in <Reveal>: a lazy iframe that starts hidden never loads in Chrome.
            <div className="relative h-full min-h-[20rem] overflow-hidden rounded-brand border border-ivory/10">
                <iframe
                  title={`${site.fullName} on Google Maps`}
                  src={site.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full"
                  style={{ border: 0, filter: "grayscale(0.35) sepia(0.25) contrast(1.05)" }}
                />
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-shell px-6 pb-10">
        <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(196,137,46,0.45), transparent)" }} />
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              {logoMark && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoMark} alt="" aria-hidden className="h-10 w-10 object-contain" />
              )}
              <div>
                <p className="font-display text-2xl leading-none">{site.name}</p>
                <p className="mt-1 font-sans text-[0.62rem] uppercase tracking-[0.26em] text-saffron">{site.kicker}</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs font-sans text-sm font-light leading-relaxed text-ivory/60">{site.tagline}</p>
          </div>

          <div className="font-sans text-sm text-ivory/70">
            <p className="eyebrow" style={{ color: "var(--saffron)" }}>
              {copy.footer.areasLabel}
            </p>
            <p className="mt-3">{site.serviceAreas.join(" · ")}</p>
          </div>

          <div className="md:justify-self-end">
            {(site.instagram || site.facebook) && (
              <div className="flex items-center gap-3">
                {site.instagram && (
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="grid h-10 w-10 place-items-center rounded-full border border-ivory/25 text-ivory/80 transition-colors hover:border-saffron hover:text-saffron"
                  >
                    <Instagram size={17} />
                  </a>
                )}
                {site.facebook && (
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="grid h-10 w-10 place-items-center rounded-full border border-ivory/25 text-ivory/80 transition-colors hover:border-saffron hover:text-saffron"
                  >
                    <Facebook size={17} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-ivory/10 pt-6 text-center font-sans text-xs text-ivory/50 md:flex-row md:text-left">
          <p>
            © {year} {site.fullName} · {site.city}
          </p>
          <p>{copy.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
