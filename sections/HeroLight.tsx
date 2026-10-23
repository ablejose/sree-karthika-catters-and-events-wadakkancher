"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { BananaLeaf, LEAF_GREEN } from "@/components/BananaLeaf";
import { copy, event, logoMark, site, stories, waLink } from "@/config/site";
import { t } from "@/lib/copy";

/**
 * LIGHT HERO — white, logo-led, no photos (event.heroTone = "light"). The
 * Malayalam line arrives word by word once the loader has lifted (whole words,
 * so Malayalam conjuncts never split), a gold rule draws under it, and an
 * optional second line cycles its first word (event.heroRotate).
 */
const EASE = [0.22, 1, 0.36, 1] as const;
const LOADER_MS = 2500; // the loader holds ~2.3s before lifting
const ROTATE_MS = 2200;

export default function HeroLight() {
  const [go, setGo] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [word, setWord] = useState(0);
  const rotate = event.heroRotate;
  const words = (site.taglineMl ?? "").split(/\s+/).filter(Boolean);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(r);
    const id = window.setTimeout(() => setGo(true), r ? 0 : LOADER_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!go || reduce || !rotate || rotate.words.length < 2) return;
    const id = window.setInterval(() => setWord((w) => (w + 1) % rotate.words.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [go, reduce, rotate]);

  const lineDone = 0.35 + words.length * 0.14;

  return (
    <section id="hero" className="relative flex min-h-[92svh] w-full items-center overflow-hidden bg-white pb-16 pt-28 md:pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[38%] h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(196,137,46,0.10) 0%, rgba(196,137,46,0) 68%)" }} />
        <BananaLeaf className="absolute -left-40 top-24 w-[34rem] rotate-[24deg] md:-left-24 md:w-[44rem]" style={{ opacity: 0.06 }} />
        <BananaLeaf className="absolute -right-44 bottom-6 w-[32rem] rotate-[200deg] md:-right-24 md:w-[42rem]" style={{ opacity: 0.05 }} />
      </div>

      <div className="relative mx-auto flex w-full max-w-shell flex-col items-center px-6 text-center">
        {logoMark && (
          <motion.img
            src={logoMark}
            alt=""
            aria-hidden
            className="h-24 w-24 object-contain md:h-28 md:w-28"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={go ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: EASE }}
          />
        )}

        <p className="eyebrow eyebrow-center mt-6 whitespace-nowrap text-[0.62rem] sm:text-[0.72rem]">{t(copy.hero.eyebrow)}</p>

        <h1 className="mt-4 flex flex-col items-center">
          <span className="display-xl text-espresso" style={{ fontSize: "clamp(3rem, 8.5vw, 6.2rem)" }}>
            {site.name}
          </span>
          <span className="mt-2 font-sans text-[0.75rem] font-semibold uppercase text-saffron-2 md:text-sm" style={{ letterSpacing: "0.42em", paddingLeft: "0.42em" }}>
            {site.descriptor}
          </span>
        </h1>

        {words.length > 0 && (
          <div className="mt-8 flex flex-col items-center">
            <p lang="ml" className="ml-display flex flex-wrap justify-center gap-x-[0.32em] italic [font-synthesis:weight_style]" style={{ fontSize: "clamp(1.6rem, 4.2vw, 2.9rem)", color: LEAF_GREEN }}>
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                  animate={go ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                  transition={{ duration: 0.7, delay: reduce ? 0 : 0.35 + i * 0.14, ease: EASE }}
                >
                  {w}
                </motion.span>
              ))}
            </p>
            <motion.span
              aria-hidden
              className="mt-3 block h-[2px] w-40 origin-center rounded-full md:w-56"
              style={{ background: "linear-gradient(90deg, transparent, var(--saffron), transparent)" }}
              initial={{ scaleX: 0 }}
              animate={go ? { scaleX: 1 } : {}}
              transition={{ duration: 0.9, delay: reduce ? 0 : lineDone, ease: EASE }}
            />
          </div>
        )}

        {rotate && rotate.words.length > 0 && (
          <motion.p
            lang="ml"
            className="ml mt-6 flex items-center justify-center gap-2 text-[1.05rem] text-espresso/80 md:text-[1.2rem]"
            initial={{ opacity: 0 }}
            animate={go ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: reduce ? 0 : lineDone + 0.3 }}
          >
            <span className="relative inline-grid h-[2.1em] min-w-[6.5em] place-items-center overflow-hidden rounded-full bg-[var(--saffron-soft)] px-4 text-saffron-2">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={word}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-110%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="whitespace-nowrap"
                >
                  {rotate.words[word]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span>{rotate.after}</span>
          </motion.p>
        )}

        <motion.div
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          animate={go ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: reduce ? 0 : lineDone + 0.45, ease: EASE }}
        >
          <Button href={copy.cta.primaryHref} variant="gold">
            {copy.cta.secondary}
          </Button>
          <Button href={waLink()} variant="outline" external>
            <WhatsAppIcon size={17} /> {copy.cta.whatsapp}
          </Button>
        </motion.div>

        {stories.length > 0 && (
          <a href="#stories" className="mt-12 flex flex-col items-center gap-1 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-muted transition-colors hover:text-espresso">
            {copy.hero.scroll}
            <ChevronDown size={18} className="animate-bounce" />
          </a>
        )}
      </div>
    </section>
  );
}
