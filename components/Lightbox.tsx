"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/config/gallery";
import { Img } from "@/components/ui/Img";

export default function Lightbox({
  items,
  index,
  onClose,
  onNav,
}: {
  items: GalleryItem[];
  index: number | null;
  onClose: () => void;
  onNav: (next: number) => void;
}) {
  const open = index !== null;

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      onNav((index + dir + items.length) % items.length);
    },
    [index, items.length, onNav]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go, onClose]);

  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button aria-label="Close" onClick={onClose} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-ivory/30 text-ivory hover:bg-ivory/10">
            <X size={22} />
          </button>
          <button
            aria-label="Previous image"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-ivory/30 text-ivory hover:bg-ivory/10 md:left-6"
          >
            <ChevronLeft size={24} />
          </button>
          <motion.figure
            key={index}
            className="max-h-[85vh] max-w-4xl overflow-hidden rounded-brand"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1);
              if (info.offset.x > 80) go(-1);
            }}
          >
            {/* Eager: a lazy image inside a just-opened overlay can sit unloaded at 0x0, leaving only its alt text. */}
            <Img src={item.src} alt={item.alt} fallbackSeed={item.src} priority className="h-auto max-h-[78vh] w-auto max-w-full object-contain" />
            <figcaption className="bg-ink px-4 py-3 font-sans text-sm text-ivory/80">{item.alt}</figcaption>
          </motion.figure>
          <button
            aria-label="Next image"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-ivory/30 text-ivory hover:bg-ivory/10 md:right-6"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
