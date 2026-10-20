"use client";

import { useEffect, useRef } from "react";

type RevealProps = {
  children: React.ReactNode;
  y?: number;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

export default function Reveal({ children, y = 24, delay = 0, as = "div", className }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.opacity = "1";
      return;
    }
    let ctx: any;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          node,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            delay,
            ease: "power3.out",
            scrollTrigger: { trigger: node, start: "top 85%", once: true },
          }
        );
      }, node);
    })();
    return () => ctx?.revert();
  }, [y, delay]);

  const Tag = as as any;
  return (
    <Tag ref={ref as any} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}
