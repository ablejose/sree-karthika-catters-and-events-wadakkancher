type RevealProps = {
  children: React.ReactNode;
  /** Kept for call-site compatibility; content no longer animates in. */
  y?: number;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
};

/**
 * Plain wrapper. Content used to fade and slide in on scroll (GSAP ScrollTrigger),
 * but animating opacity + transform on whole blocks as they entered the screen
 * forced extra compositing layers and re-rasterising mid-scroll — measurable
 * dropped frames ("jerk") in scripts/scroll-jerk-test.mjs. See jerk.md.
 * Content now renders in place immediately.
 */
export default function Reveal({ children, as = "div", className }: RevealProps) {
  const Tag = as as any;
  return <Tag className={className}>{children}</Tag>;
}
