"use client";

import { useState } from "react";

const FALLBACK =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#27272a"/>
          <stop offset="100%" style="stop-color:#18181b"/>
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#g)"/>
      <text x="200" y="300" text-anchor="middle" fill="#71717a" font-size="48">🌏</text>
    </svg>`
  );

interface ThumbnailImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ThumbnailImage({ src, alt, className }: ThumbnailImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setCurrentSrc(FALLBACK)}
    />
  );
}
