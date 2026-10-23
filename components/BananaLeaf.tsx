"use client";

import { useId } from "react";

export const LEAF_GREEN = "#2F6B3A";

/** A stylised banana leaf (midrib + veins), used as faint decoration on sadya sites. */
export function BananaLeaf({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const clip = `leaf-${useId().replace(/:/g, "")}`;
  const veins = Array.from({ length: 15 }, (_, i) => {
    const x = 40 + i * 36;
    const y = 148 - (x / 600) * 108; // along the midrib
    return { x, y };
  });
  return (
    <svg viewBox="0 0 600 220" className={className} style={style} aria-hidden>
      <defs>
        <clipPath id={clip}>
          <path d="M6 152 C 120 34, 390 4, 594 40 C 430 132, 210 206, 6 152 Z" />
        </clipPath>
      </defs>
      <path d="M6 152 C 120 34, 390 4, 594 40 C 430 132, 210 206, 6 152 Z" fill={LEAF_GREEN} />
      <g clipPath={`url(#${clip})`} stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2" fill="none">
        <path d="M6 152 C 200 104, 400 64, 594 40" strokeWidth="4" />
        {veins.map((v, i) => (
          <g key={i}>
            <path d={`M${v.x} ${v.y} L ${v.x + 30} ${v.y - 70}`} />
            <path d={`M${v.x} ${v.y} L ${v.x - 18} ${v.y + 70}`} />
          </g>
        ))}
      </g>
    </svg>
  );
}
