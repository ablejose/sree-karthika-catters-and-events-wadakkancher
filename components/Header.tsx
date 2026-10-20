"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Phone } from "lucide-react";
import { site, navLinks, telLink, waLink, copy, logoMark } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  // Target to scroll to AFTER the mobile drawer has finished closing.
  const pendingHash = useRef<string | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll only while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Tap a mobile nav link: remember the target, close the drawer, and scroll
  // only once the close animation has finished (see onExitComplete below).
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      pendingHash.current = href;
    }
    setOpen(false);
  };

  const runPendingScroll = () => {
    const href = pendingHash.current;
    pendingHash.current = null;
    if (!href) return;
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) return;
    const header = document.querySelector("header");
    const offset = header ? header.getBoundingClientRect().height : 0;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid
          ? "border-b border-sand/70 bg-[rgba(255,255,255,0.88)] backdrop-blur-[16px]"
          : "border-b border-espresso/30 bg-[rgba(36,28,21,0.92)] backdrop-blur-[10px]"
      )}
    >
      <div className="mx-auto flex max-w-shell items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3 leading-none" aria-label={`${site.fullName} home`}>
          {logoMark && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoMark} alt="" aria-hidden className="h-9 w-9 object-contain" />
          )}
          <span className="flex flex-col">
          <span className={cn("font-display text-2xl tracking-wide transition-colors", solid ? "text-espresso" : "text-ivory")}>
            {site.name}
          </span>
          <span className={cn("mt-0.5 font-sans text-[0.6rem] uppercase tracking-[0.24em] transition-colors", solid ? "text-saffron-2" : "text-ivory/70")}>
            {site.kicker}
          </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn("link-underline font-sans text-sm transition-colors", solid ? "text-ink hover:text-espresso" : "text-ivory/90 hover:text-ivory")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={telLink}
            aria-label="Call us"
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full border transition-colors",
              solid ? "border-sand text-espresso hover:bg-[var(--saffron-soft)]" : "border-ivory/40 text-ivory hover:bg-ivory/10"
            )}
          >
            <Phone size={16} />
          </a>
          <Button href={copy.cta.primaryHref} variant={solid ? "primary" : "gold"}>
            {copy.cta.primary}
          </Button>
        </div>

        <button
          className={cn("grid h-10 w-10 place-items-center rounded-full transition-colors lg:hidden", solid ? "text-espresso" : "text-ivory")}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence onExitComplete={runPendingScroll}>
        {open && (
          <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Backdrop — tap outside the panel to close */}
            <motion.div
              aria-hidden
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Drawer */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-espresso px-6 pb-8 pt-5 text-ivory shadow-[0_0_60px_rgba(0,0,0,0.5)]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl">{site.name}</span>
                <button aria-label="Close menu" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full text-ivory">
                  <X size={22} />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-1" aria-label="Mobile">
                {navLinks.map((l, i) => (
                  <motion.div key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.08 }}>
                    <a href={l.href} onClick={(e) => handleNavClick(e, l.href)} className="block border-b border-ivory/10 py-4 font-display text-3xl">
                      {l.label}
                    </a>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3">
                <Button href={waLink()} variant="whatsapp" external onClick={() => setOpen(false)}>
                  {copy.cta.whatsapp}
                </Button>
                <Button href={telLink} variant="outline" className="border-ivory/50 text-ivory" onClick={() => setOpen(false)}>
                  Call {site.phone}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
