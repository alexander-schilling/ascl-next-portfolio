"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import Image from "next/image";
import { InstagramIcon } from "@/components/ui/social-icons";

import { SectionIntro } from "@/components/ui/section-intro";
import { SectionShell } from "@/components/ui/section-shell";
import { ContentIcon, getSectionIconTone } from "@/lib/content-icons";
import type { PassionContent, PhotoCard } from "@/types/portfolio";

type PassionsSectionProps = {
  content: PassionContent;
};

const DEFAULT_REMOTE_PHOTO_TITLE = "Instagram photo";

// ─── Lightbox ────────────────────────────────────────────────────────────────

type LightboxProps = {
  photos: PhotoCard[];
  initialIndex: number;
  onClose: () => void;
  viewPostLabel: string;
};

function Lightbox({ photos, initialIndex, onClose, viewPostLabel }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const current = photos[index];
  const hasMany = photos.length > 1;
  const imgRef = useRef<HTMLImageElement>(null);

  const goPrev = useCallback(
    () => setIndex((i) => (i - 1 + photos.length) % photos.length),
    [photos.length],
  );
  const goNext = useCallback(
    () => setIndex((i) => (i + 1) % photos.length),
    [photos.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, goPrev, goNext]);

  const showTitle = current.title && current.title !== DEFAULT_REMOTE_PHOTO_TITLE;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

      {/* Close */}
      <button
        type="button"
        aria-label="Close lightbox"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 ring-1 ring-white/10 transition-all hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      {hasMany && (
        <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white/60 ring-1 ring-white/10">
          {index + 1} / {photos.length}
        </div>
      )}

      {/* Image container */}
      <div
        className="relative z-10 flex max-h-[85dvh] max-w-[90vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          key={current.imageUrl}
          src={current.imageUrl}
          alt={current.title}
          className="max-h-[78dvh] max-w-[90vw] rounded-xl object-contain shadow-2xl ring-1 ring-white/5"
          style={{ display: "block" }}
        />

        {/* Bottom action bar */}
        <div className="mt-3 flex w-full items-center justify-between gap-4 px-1">
          <span className="truncate text-sm font-medium text-white/60">
            {showTitle ? current.title : ""}
          </span>
          {current.href ? (
            <a
              href={current.href}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-full bg-linear-to-r from-pink-600 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
              onClick={(e) => e.stopPropagation()}
            >
              <InstagramIcon className="h-3.5 w-3.5" />
              {viewPostLabel}
            </a>
          ) : null}
        </div>
      </div>

      {/* Prev / Next */}
      {hasMany && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white/70 ring-1 ring-white/10 transition-all hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white/70 ring-1 ring-white/10 transition-all hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

// ─── Gallery card ─────────────────────────────────────────────────────────────

type GalleryCardProps = {
  photo: PhotoCard;
  aspectRatio: number | undefined;
  onZoom: () => void;
};

function GalleryCard({ photo, aspectRatio, onZoom }: GalleryCardProps) {
  const resolvedRatio = aspectRatio ?? (photo.featured ? 16 / 9 : 4 / 5);

  return (
    <article className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-surface-container">
      <button
        type="button"
        aria-label={`Zoom photo: ${photo.title}`}
        onClick={onZoom}
        className="block w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: resolvedRatio }}
        >
          <Image
            src={photo.imageUrl}
            alt={photo.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 42vw, 100vw"
          />

          {/* Gradient overlay — always available for tonal depth */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Hover action buttons */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            {/* Title (if meaningful) */}
            {photo.title && photo.title !== DEFAULT_REMOTE_PHOTO_TITLE ? (
              <p className="mr-2 line-clamp-2 text-left text-xs font-medium leading-snug text-white drop-shadow">
                {photo.title}
              </p>
            ) : (
              <span />
            )}

            <div className="flex shrink-0 items-center gap-2">
              {/* Zoom button */}
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-transform hover:scale-110"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
                </svg>
              </span>

              {/* Instagram button — only if post link exists */}
              {photo.href ? (
                <a
                  href={photo.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open in Instagram: ${photo.title}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-pink-600 to-purple-600 text-white shadow-lg ring-1 ring-white/10 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                >
                  <InstagramIcon className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function PassionsSection({ content }: PassionsSectionProps) {
  const contentKey = `${content.instagramHandle}:${content.instagramUrl}`;
  const [remoteGallery, setRemoteGallery] = useState<{ key: string; photos: PhotoCard[] } | null>(null);
  const [photoRatios, setPhotoRatios] = useState<Record<string, number>>({});
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const revealRef = useReveal<HTMLDivElement>();

  const gallery =
    remoteGallery?.key === contentKey && remoteGallery.photos.length > 0
      ? remoteGallery.photos
      : content.gallery;

  useEffect(() => {
    let ignore = false;

    async function loadRemotePhotos() {
      try {
        const response = await fetch("/api/portfolio/photos", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const payload: unknown = await response.json();

        if (!Array.isArray(payload) || payload.length === 0 || ignore) {
          return;
        }

        const photos = payload.filter((item): item is PhotoCard => {
          if (!item || typeof item !== "object") {
            return false;
          }

          const candidate = item as Partial<PhotoCard>;
          return typeof candidate.title === "string" && typeof candidate.imageUrl === "string";
        });

        if (photos.length > 0) {
          setRemoteGallery({ key: contentKey, photos });
        }
      } catch {
        // Keep SSR fallback gallery if remote photos fail.
      }
    }

    void loadRemotePhotos();

    return () => {
      ignore = true;
    };
  }, [contentKey]);

  useEffect(() => {
    let ignore = false;

    const photosWithoutRatio = gallery.filter((photo) => photoRatios[photo.imageUrl] === undefined);

    for (const photo of photosWithoutRatio) {
      const image = new window.Image();

      image.onload = () => {
        if (ignore || image.naturalWidth === 0 || image.naturalHeight === 0) {
          return;
        }

        const ratio = image.naturalWidth / image.naturalHeight;
        setPhotoRatios((current) =>
          current[photo.imageUrl] === undefined
            ? { ...current, [photo.imageUrl]: ratio }
            : current,
        );
      };

      image.src = photo.imageUrl;
    }

    return () => {
      ignore = true;
    };
  }, [gallery, photoRatios]);

  return (
    <SectionShell id="passions" className="overflow-hidden bg-surface-container-low">
      <div ref={revealRef} className="reveal">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionIntro
          title={
            <span className="inline-flex items-center gap-4">
              <ContentIcon
                iconKey={content.iconKey}
                fallbackIconKey="camera"
                className={["h-8 w-8", getSectionIconTone(content.iconKey)].join(" ")}
                aria-hidden={true}
              />
              <span>{content.heading}</span>
            </span>
          }
          description={content.description}
        />
        <a
          href={content.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full bg-linear-to-r from-pink-600 to-purple-600 px-6 py-2 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
        >
          <InstagramIcon className="mr-2 h-4 w-4" />
          {content.instagramHandle}
        </a>
      </div>

      <div className="columns-1 gap-4 md:columns-2 xl:columns-4">
        {gallery.map((photo, index) => (
          <GalleryCard
            key={photo.imageUrl}
            photo={photo}
            aspectRatio={photoRatios[photo.imageUrl]}
            onZoom={() => setLightboxIndex(index)}
          />
        ))}
      </div>

      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={gallery}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          viewPostLabel={content.viewPostLabel}
        />
      )}
    </SectionShell>
  );
}
