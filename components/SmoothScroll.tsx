"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scroll driving GSAP ScrollTrigger.
 * Dynamic imports inside useEffect avoid SSR/hydration issues.
 * Disabled under prefers-reduced-motion and on coarse pointers.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    if (reduce) return;

    let lenis: any;
    let cleanupTicker: (() => void) | null = null;

    (async () => {
      const Lenis = (await import("lenis")).default;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({ duration: 1.15, smoothWheel: true, touchMultiplier: 1.4, anchors: { offset: -72 } });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanupTicker = () => gsap.ticker.remove(tick);
    })();

    return () => {
      cleanupTicker?.();
      lenis?.destroy?.();
    };
  }, []);

  return <>{children}</>;
}
