"use client";

import { useEffect, useState } from "react";
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

export function PassionsSection({ content }: PassionsSectionProps) {
  const contentKey = `${content.instagramHandle}:${content.instagramUrl}`;
  const [remoteGallery, setRemoteGallery] = useState<{ key: string; photos: PhotoCard[] } | null>(null);
  const [photoRatios, setPhotoRatios] = useState<Record<string, number>>({});

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
          className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-2 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
        >
          <InstagramIcon className="mr-2 h-4 w-4" />
          {content.instagramHandle}
        </a>
      </div>

      <div className="columns-1 gap-4 md:columns-2 xl:columns-4">
        {gallery.map((photo) => {
          const photoContent = (
            <article className="relative overflow-hidden rounded-2xl bg-surface-container">
              <div
                className="relative w-full overflow-hidden bg-black/10"
                style={{
                  aspectRatio: photoRatios[photo.imageUrl] ?? (photo.featured ? "16 / 9" : "4 / 5"),
                }}
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  className="object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="(min-width: 1280px) 22vw, (min-width: 768px) 42vw, 100vw"
                />
                {photo.href ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {photo.title !== DEFAULT_REMOTE_PHOTO_TITLE ? (
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="line-clamp-2 text-sm font-medium text-white drop-shadow-sm">
                          {photo.title}
                        </p>
                      </div>
                    ) : null}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                      <InstagramIcon className="h-3 w-3 text-white" />
                      <span className="text-[10px] font-semibold leading-none text-white">
                        {content.viewPostLabel}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            </article>
          );

          if (photo.href) {
            return (
              <a
                key={photo.imageUrl}
                href={photo.href}
                target="_blank"
                rel="noreferrer"
                className="group mb-4 block break-inside-avoid"
              >
                {photoContent}
              </a>
            );
          }

          return (
            <div key={photo.imageUrl} className="mb-4 break-inside-avoid">
              {photoContent}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
