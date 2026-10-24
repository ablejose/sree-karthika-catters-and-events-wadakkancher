"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SliderPhoto {
  src: string;
  alt: string;
  /** "cover" fills the frame (default); "contain" shows the whole photo (wide shots). */
  fit?: "cover" | "contain";
}

/**
 * One photo at a time in a fixed 4:5 frame, with back / next arrows, dots, swipe
 * on touch and arrow keys. The frame never changes size (no layout shift), only
 * the current photo and its neighbours are loaded, and photos cross-fade with
 * opacity only — nothing heavy to paint while the page scrolls (see jerk.md).
 */
export function PhotoSlider({ photos, label, className }: { photos: SliderPhoto[]; label: string; className?: string }) {
  const [i, setI] = useState(0);
  const n = photos.length;
  const touch = useRef<number | null>(null);
  const go = (d: number) => setI((x) => (x + d + n) % n);
  const near = (k: number) => k === i || k === (i + 1) % n || k === (i - 1 + n) % n;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
      className={cn("group relative overflow-hidden rounded-[30px] bg-[#F3F7EE] shadow-[0_12px_28px_-16px_rgba(36,28,21,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron", className)}
    >
      <div className="relative aspect-[4/5]">
        {photos.map((p, k) =>
          near(k) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.src}
              src={p.src}
              alt={k === i ? p.alt : ""}
              aria-hidden={k !== i}
              loading={k === 0 ? "eager" : "lazy"}
              decoding="async"
              className={cn(
                "absolute inset-0 h-full w-full transition-opacity duration-500",
                p.fit === "contain" ? "object-contain p-3" : "object-cover",
                k === i ? "opacity-100" : "opacity-0"
              )}
            />
          ) : null
        )}
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-espresso shadow-[0_4px_12px_-6px_rgba(36,28,21,0.6)] transition-colors hover:bg-white"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-espresso shadow-[0_4px_12px_-6px_rgba(36,28,21,0.6)] transition-colors hover:bg-white"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
            {photos.map((p, k) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setI(k)}
                aria-label={`Photo ${k + 1} of ${n}`}
                aria-current={k === i}
                className={cn("h-2 rounded-full transition-all", k === i ? "w-6 bg-white" : "w-2 bg-white/60")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
