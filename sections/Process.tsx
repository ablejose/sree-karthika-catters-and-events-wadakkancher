"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { processSteps as steps } from "@/config/process";
import { copy } from "@/config/site";
import { t } from "@/lib/copy";

/**
 * PROCESS TRUST — "How we work". Template-level content (config/template.ts):
 * the same flow works for every catering/event client, so a new event inherits
 * it. Override per event only when the workflow genuinely differs.
 */
const STEP_DELAY = 0.45; // seconds between each badge turning black (desktop sweep)

export default function Process() {
  const olRef = useRef<HTMLOListElement | null>(null);
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [activeSteps, setActiveSteps] = useState<boolean[]>(() => steps.map(() => false));
  const [lineActive, setLineActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const lineDuration = (steps.length - 1) * STEP_DELAY + 0.5;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveSteps(steps.map(() => true));
      setLineActive(true);
      return;
    }

    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    setIsDesktop(desktop);

    if (desktop) {
      const node = olRef.current;
      if (!node) return;
      // Start only once the steps have scrolled up to the middle of the screen.
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setActiveSteps(steps.map(() => true));
              setLineActive(true);
              io.disconnect();
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px -50% 0px" }
      );
      io.observe(node);
      return () => io.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const idx = Number((e.target as HTMLElement).dataset.idx);
          setActiveSteps((prev) => {
            if (prev[idx]) return prev;
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        });
      },
      { threshold: 0, rootMargin: "0px 0px -50% 0px" }
    );
    liRefs.current.forEach((li) => li && io.observe(li));
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" aria-labelledby="process-heading" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-shell px-6">
        <Reveal>
          <p className="eyebrow">{copy.process.eyebrow}</p>
          <h2 id="process-heading" className="display mt-4 max-w-3xl text-saffron-2" style={{ fontSize: "clamp(1.9rem, 3.6vw, 3rem)" }}>
            {copy.process.heading}
          </h2>
          <p className="body-copy mt-4 max-w-xl">{t(copy.process.body)}</p>
        </Reveal>

        <ol ref={olRef} className="relative mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-10 lg:mt-14 lg:grid-cols-5 lg:gap-6">
          {/* Phones: a compact vertical timeline — badge on the left, text beside it. */}
          <div aria-hidden className="pointer-events-none absolute bottom-6 left-[21px] top-6 w-px bg-sand sm:hidden" />
          <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-sand lg:block" />
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-8 hidden h-px bg-ink lg:block"
            style={{ width: lineActive ? "100%" : "0%", transition: `width ${lineDuration}s ease-out` }}
          />
          {steps.map((s, i) => (
            <li
              key={s.n}
              ref={(el) => {
                liRefs.current[i] = el;
              }}
              data-idx={i}
              className="relative"
            >
              <div className="flex items-start gap-4 sm:flex-col sm:gap-0">
                <span
                  className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border font-display text-lg shadow-[0_14px_30px_-16px_rgba(196,137,46,0.6)] transition-all duration-500 sm:h-16 sm:w-16 sm:text-2xl ${
                    activeSteps[i] ? "border-ink bg-ink text-ivory" : "border-saffron bg-white text-saffron-2"
                  }`}
                  style={{ transitionDelay: isDesktop ? `${i * STEP_DELAY}s` : "0s" }}
                >
                  {s.n}
                </span>
                <div className="min-w-0 pt-1.5 sm:pt-0">
                  <h3 className="font-display text-lg text-saffron-2 sm:mt-5 sm:text-xl">{s.title}</h3>
                  <p className="body-copy mt-1 sm:mt-2">{t(s.text)}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
