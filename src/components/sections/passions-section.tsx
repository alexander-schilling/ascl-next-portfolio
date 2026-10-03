"use client";

import { useEffect, useState } from "react";
import { Expand, ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { InstagramIcon } from "@/components/ui/social-icons";
import { SectionIntro } from "@/components/ui/section-intro";
import { SectionShell } from "@/components/ui/section-shell";
import { PhotoImage, PhotoViewer, galleryLabels, photoLabel } from "./photo-viewer";
import { ContentIcon, getSectionIconTone } from "@/lib/content-icons";
import type { PassionContent, PhotoCard } from "@/types/portfolio";

export function PassionsSection({ content, lang }: { content: PassionContent; lang: "es" | "en" }) {
  const contentKey = `${content.instagramHandle}:${content.instagramUrl}`;
  const [remoteGallery, setRemoteGallery] = useState<{ key: string; photos: PhotoCard[] } | null>(null);
  // Snapshot the gallery on open so a concurrent refresh never replaces the selected photo.
  const [viewer, setViewer] = useState<{ photos: PhotoCard[]; index: number } | null>(null);
  const revealRef = useReveal<HTMLDivElement>();
  const text = galleryLabels[lang];
  const remote = remoteGallery?.key === contentKey ? remoteGallery : null;
  const gallery = remote?.photos.length ? remote.photos : content.gallery;

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    async function loadPhotos() {
      try {
        const response = await fetch("/api/portfolio/photos", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Photos unavailable");
        const payload: unknown = await response.json();
        const photos = Array.isArray(payload) ? payload.filter((item): item is PhotoCard => {
          if (!item || typeof item !== "object") return false;
          const candidate = item as Partial<PhotoCard>;
          return typeof candidate.title === "string" && typeof candidate.imageUrl === "string" && !!candidate.imageUrl.trim();
        }) : [];
        if (!disposed) setRemoteGallery({ key: contentKey, photos });
      } catch {
        if (!disposed) setRemoteGallery({ key: contentKey, photos: [] });
      } finally {
        window.clearTimeout(timeout);
      }
    }
    void loadPhotos();
    return () => { disposed = true; window.clearTimeout(timeout); controller.abort(); };
  }, [contentKey]);

  return (
    <SectionShell id="passions" className="bg-surface-container-low">
      <div ref={revealRef} className="reveal">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionIntro title={
            <span className="inline-flex items-center gap-3">
              <ContentIcon iconKey={content.iconKey} fallbackIconKey="camera"
                className={["h-7 w-7 shrink-0", getSectionIconTone(content.iconKey)].join(" ")} aria-hidden />
              <span>{content.heading}</span>
            </span>} description={content.description} />
          <a href={content.instagramUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-high">
            <InstagramIcon className="h-4 w-4" aria-hidden />{content.instagramHandle}<ArrowUpRight size={16} aria-hidden />
          </a>
        </div>

        {gallery.length ? (
          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
            {gallery.map((photo, index) => {
              const title = photoLabel(photo, index, lang);
              const featured = index === 0 && photo.featured;
              return (
                <article key={photo.imageUrl} className={featured ? "md:col-span-2 md:row-span-2" : ""}>
                  <button type="button" aria-label={`${text.open}: ${title}`}
                    onClick={() => setViewer({ photos: gallery, index })}
                    className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-surface-container-high">
                    <PhotoImage photo={photo} alt={title} errorLabel={text.error} loadingLabel={text.loading}
                      sizes={featured ? "(min-width: 1280px) 800px, (min-width: 768px) 65vw, 100vw" : "(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw"} />
                    <span className="absolute right-3 bottom-3 flex h-11 w-11 items-center justify-center rounded-lg bg-background/90 text-on-surface transition-colors group-hover:bg-primary group-hover:text-on-primary" aria-hidden>
                      <Expand size={18} />
                    </span>
                  </button>
                  <div className="flex min-h-12 items-center justify-between gap-3 pt-1">
                    <span className="min-w-0 truncate text-sm text-on-surface-variant">{title}</span>
                    {photo.href && <a href={photo.href} target="_blank" rel="noopener noreferrer" aria-label={`${text.instagram}: ${title}`}
                      className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 text-sm text-primary hover:underline">
                      <InstagramIcon className="h-4 w-4" aria-hidden /><ArrowUpRight size={16} aria-hidden />
                    </a>}
                  </div>
                </article>
              );
            })}
          </div>
        ) : !remote ? (
          <div role="status" aria-label={text.remoteLoading}>
            <p className="sr-only">{text.remoteLoading}</p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3" aria-hidden>
              {Array.from({ length: 5 }, (_, index) => <div key={index}
                className={`aspect-[4/5] rounded-2xl bg-surface-container-high ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`} />)}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-outline-variant bg-surface-container px-6 py-12 text-center text-on-surface-variant" role="status">{text.empty}</div>
        )}
      </div>
      {viewer && <PhotoViewer photos={viewer.photos} initialIndex={viewer.index} lang={lang}
        onClose={() => setViewer(null)} viewPostLabel={content.viewPostLabel} />}
    </SectionShell>
  );
}
