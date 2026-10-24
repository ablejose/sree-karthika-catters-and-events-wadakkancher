"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Story clips load one at a time, top of the page first. Every StoryVideo joins
 * this queue; once the page itself has loaded, the queue downloads them in
 * document order, each completely before the next starts, so the clip nearest the
 * top is always ready first and the clips never compete for bandwidth.
 * A clip the visitor scrolls to early still starts at once (play() fetches it).
 */
const queue: HTMLVideoElement[] = [];
let started = false;

/**
 * Fetch each clip completely, in document order, then hand the finished file to its
 * <video> (a blob URL). Browsers stop buffering a paused, off-screen video after a
 * few seconds, so preload="auto" alone cannot guarantee "top clip fully first".
 * A clip that has already started on its own (the visitor scrolled to it) is skipped.
 */
async function loadInOrder() {
  if (started) return;
  started = true;
  const ordered = [...queue].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
  for (const v of ordered) {
    if (!v.isConnected || v.readyState > 0) continue;
    try {
      const res = await fetch(v.currentSrc || v.src);
      if (!res.ok) continue;
      const blob = await res.blob();
      // Only swap if the clip has not started loading by itself meanwhile.
      if (v.readyState === 0 && v.paused) {
        const wasVisible = v.dataset.visible === "1";
        v.src = URL.createObjectURL(blob);
        if (wasVisible) v.play().catch(() => {});
      }
    } catch {
      // network hiccup: the clip still loads on its own when it comes into view
    }
  }
}

function enqueue(v: HTMLVideoElement) {
  queue.push(v);
  if (started) return;
  const kick = () => window.setTimeout(loadInOrder, 300);
  if (document.readyState === "complete") kick();
  else window.addEventListener("load", kick, { once: true });
}

/**
 * A short (< 6 s), muted, looping clip. It plays while at least a third of it is
 * visible and pauses when it leaves. With reduced motion it waits on its poster
 * until tapped. Tap toggles play/pause either way.
 */
export function StoryVideo({ src, poster, alt, className }: { src: string; poster: string; alt: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [manual, setManual] = useState(false); // reduced motion, or the visitor paused it

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    enqueue(v);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setManual(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        v.dataset.visible = e.isIntersecting ? "1" : "0";
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
