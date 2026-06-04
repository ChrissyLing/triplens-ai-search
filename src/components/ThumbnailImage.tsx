"use client";

import { useEffect, useState } from "react";

function makeFallback(label: string) {
  const text = label.slice(0, 12);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
    <rect width="400" height="600" fill="#27272a"/>
    <text x="200" y="300" text-anchor="middle" fill="#a1a1aa" font-size="18" font-family="system-ui,sans-serif">${text}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

interface ThumbnailImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ThumbnailImage({ src, alt, className }: ThumbnailImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setCurrentSrc(makeFallback(alt))}
    />
  );
}
