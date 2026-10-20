"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Resilient <img>: falls back to a deterministic placeholder if the source
 * fails to load, so the layout never shows a broken image. Lazy + async by default.
 */
export function Img({
  src,
  alt,
  className,
  fallbackSeed,
  width = 1200,
  height = 1500,
  priority = false,
  ...rest
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackSeed?: string;
  width?: number;
  height?: number;
  priority?: boolean;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className">) {
  const [errored, setErrored] = useState(false);
  const seed = encodeURIComponent(fallbackSeed || alt || "event");
  const fallback = `https://picsum.photos/seed/${seed}/${width}/${height}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={errored ? fallback : src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
      onError={() => setErrored(true)}
      {...rest}
    />
  );
}
