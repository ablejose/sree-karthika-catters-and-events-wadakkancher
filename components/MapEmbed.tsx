"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

/**
 * Click-to-load Google Map. An embedded map loads a heavy cross-origin page; doing
 * that automatically as the visitor scrolls towards Contact dropped frames
 * (scripts/scroll-jerk-test.mjs, see jerk.md). Now nothing loads until asked.
 */
export function MapEmbed({ src, title, address, label }: { src: string; title: string; address: string; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative h-full min-h-[20rem] overflow-hidden rounded-brand border border-ivory/10 bg-[#2b221a]">
      {show ? (
        <iframe
          title={title}
          src={src}
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full"
          style={{ border: 0, filter: "grayscale(0.35) sepia(0.25) contrast(1.05)" }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShow(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
          style={{ backgroundImage: "radial-gradient(circle at 50% 45%, rgba(196,137,46,0.18), rgba(196,137,46,0) 60%)" }}
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-saffron text-espresso transition-transform group-hover:scale-105">
            <MapPin size={24} />
          </span>
          <span className="max-w-xs font-sans text-sm text-ivory/75">{address}</span>
          <span className="rounded-full border border-ivory/30 px-5 py-2.5 font-sans text-sm font-medium text-ivory transition-colors group-hover:border-saffron group-hover:text-saffron">
            {label}
          </span>
        </button>
      )}
    </div>
  );
}
