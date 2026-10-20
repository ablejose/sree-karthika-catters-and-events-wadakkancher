"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { waLink } from "@/config/site";

export default function WhatsAppFab() {
  const [visible, setVisible] = useState(false);
  const [pulsed, setPulsed] = useState(false);
  // Step aside while a section with its own WhatsApp action (the menu quote panel) is on screen.
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-hide-fab]");
    if (!targets.length) return;
    const on = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? on.add(e.target) : on.delete(e.target)));
      setCovered(on.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9;
      setVisible(past);
      if (past && !pulsed) setPulsed(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pulsed]);

  return (
    <AnimatePresence>
      {visible && !covered && (
        <motion.a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 font-sans text-sm font-medium text-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)]"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
          style={pulsed ? { animation: "pulse-ring 2s ease-out 1" } : undefined}
        >
          <WhatsAppIcon size={18} />
          <span className="hidden sm:inline">Chat with us</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
