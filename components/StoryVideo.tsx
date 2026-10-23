"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A short, muted, looping clip that costs nothing until it is near the screen:
 * preload="none", so only the poster loads up front. It plays while at least a
 * third of it is visible and pauses when it leaves. With reduced motion it waits
 * on its poster until tapped. Tap toggles play/pause either way.
 */
export function StoryVideo({ src, poster, alt, className }: { src: string; poster: string; alt: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [manual, setManual] = useState(false); // reduced motion, or the visitor paused it

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setManual(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.33 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else {
      v.pause();
      setManual(true);
    }
  };

  return (
    <div className={cn("group relative overflow-hidden bg-espresso", className)}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        aria-label={alt}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={toggle}
        className="h-full w-full cursor-pointer object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className={cn(
          "absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-ink/55 text-ivory backdrop-blur-sm transition-opacity",
          playing && !manual ? "opacity-0 group-hover:opacity-100" : "opacity-100"
        )}
      >
        {playing ? <Pause size={16} /> : <Play size={16} className="translate-x-px" />}
      </button>
    </div>
  );
}
