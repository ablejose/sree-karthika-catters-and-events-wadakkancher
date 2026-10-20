"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { Img } from "@/components/ui/Img";
import { services } from "@/config/services";
import { copy } from "@/config/site";

/**
 * WHAT WE DO — template-level offer (config/template.ts). Event configs only
 * override this when a client genuinely sells something different.
 */
export default function Services() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches) return;
    setOpenId((cur) => (cur === id ? null : id));
  };

  return (
    <section id="services" aria-labelledby="services-heading" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-shell px-6">
        <Reveal>
          <p className="eyebrow">{copy.services.eyebrow}</p>
          <h2 id="services-heading" className="display mt-4" style={{ fontSize: "clamp(1.9rem, 3.4vw, 3rem)" }}>
            {copy.services.heading}
          </h2>
        </Reveal>

        <div className={`mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 ${services.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {services.map((s, i) => {
            const num = String(i + 1).padStart(2, "0");
            const open = openId === s.id;
            return (
              <Reveal key={s.id} delay={i * 0.1} className="h-full">
                <article
                  tabIndex={0}
                  aria-expanded={open}
                  onClick={() => toggle(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(s.id);
                    }
                  }}
                  className="group relative block aspect-[4/3] h-full cursor-pointer overflow-hidden rounded-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron sm:aspect-[3/4]"
                >
                  <Img
                    src={s.image}
                    alt={s.title}
                    fallbackSeed={s.image}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 lg:group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/45 to-ink/0" />
                  <div
                    className={`absolute inset-x-0 bottom-0 p-6 transition-opacity duration-300 lg:group-hover:opacity-0 lg:group-focus-within:opacity-0 ${
                      open ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <span className="font-sans text-xs font-semibold tracking-[0.3em] text-saffron">{num}</span>
                    <h3 className="mt-2 font-display text-2xl leading-tight text-ivory">{s.title}</h3>
                    <span className="mt-2 inline-flex items-center gap-1 font-sans text-xs text-ivory/75 lg:hidden">
                      {copy.services.tapHint}
                    </span>
                  </div>

                  <div
                    className={`absolute inset-0 flex flex-col justify-end bg-espresso/95 p-6 transition-all duration-300 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 ${
                      open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                  >
                    <span className="font-display text-xl text-saffron">{num}</span>
                    <h3 className="mt-1 font-display text-2xl text-saffron">{s.title}</h3>
                    <p className="mt-3 font-sans text-sm font-light leading-relaxed text-[#ecd4a3]">{s.blurb}</p>
                    <ul className="mt-4 space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 font-sans text-sm text-saffron">
                          <span className="mt-1 text-saffron">◆</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <span className="mt-4 font-sans text-xs text-[#ecd4a3]/70 lg:hidden">{copy.services.closeHint}</span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
