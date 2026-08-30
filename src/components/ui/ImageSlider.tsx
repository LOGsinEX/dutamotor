"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "./Icon";

interface ImageSliderProps {
  images: string[];
  alt: string;
  aspect?: string;
}

/**
 * Galeri foto yang bisa digeser (swipe di HP, tombol panah di PC).
 */
export default function ImageSlider({
  images,
  alt,
  aspect = "aspect-[4/3]",
}: ImageSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const photos = images.length > 0 ? images : [""];

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: track.clientWidth * index, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      setActive(Math.min(Math.max(index, 0), photos.length - 1));
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, [photos.length]);

  const go = (direction: -1 | 1) => {
    const next = (active + direction + photos.length) % photos.length;
    setActive(next);
    scrollToIndex(next);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-surface-soft">
      <div
        ref={trackRef}
        className="flex w-full overflow-x-auto scrollbar-hide slider-snap"
      >
        {photos.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className={`relative w-full shrink-0 ${aspect}`}
          >
            {src ? (
              <Image
                src={src}
                alt={`${alt} - foto ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
                priority={index === 0}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-muted">
                <Icon name="image" size={28} />
                <span className="text-xs font-medium">Belum ada foto</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Foto sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface/90 text-ink shadow-sm flex items-center justify-center hover:bg-surface transition-colors"
          >
            <Icon name="chevronLeft" size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Foto berikutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-surface/90 text-ink shadow-sm flex items-center justify-center hover:bg-surface transition-colors"
          >
            <Icon name="chevronRight" size={18} />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-surface/85 px-3 py-2 backdrop-blur">
            {photos.map((src, index) => (
              <button
                key={`dot-${src}-${index}`}
                type="button"
                onClick={() => {
                  setActive(index);
                  scrollToIndex(index);
                }}
                aria-label={`Lihat foto ${index + 1}`}
                className={`h-2 rounded-full transition-all ${
                  index === active
                    ? "w-5 bg-brand"
                    : "w-2 bg-line hover:bg-ink-muted"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
