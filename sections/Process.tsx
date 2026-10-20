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

        <ol ref={olRef} className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
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
              <div className="flex flex-col items-start">
                <span
                  className={`relative z-10 grid h-16 w-16 place-items-center rounded-full border font-display text-2xl shadow-[0_14px_30px_-16px_rgba(196,137,46,0.6)] transition-all duration-500 ${
                    activeSteps[i] ? "border-ink bg-ink text-ivory" : "border-saffron bg-white text-saffron-2"
                  }`}
                  style={{ transitionDelay: isDesktop ? `${i * STEP_DELAY}s` : "0s" }}
                >
                  {s.n}
                </span>
                <h3 className="mt-5 font-display text-xl text-saffron-2">{s.title}</h3>
                <p className="body-copy mt-2">{t(s.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
