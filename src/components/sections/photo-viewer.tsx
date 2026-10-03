"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { useState } from "react";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { InstagramIcon } from "@/components/ui/social-icons";
import type { PhotoCard } from "@/types/portfolio";

export const galleryLabels = {
  es: { viewer: "Visor de fotografías", close: "Cerrar visor", previous: "Fotografía anterior", next: "Fotografía siguiente",
    photo: "Fotografía", open: "Ampliar", loading: "Cargando fotografía", error: "No se pudo cargar esta fotografía.",
    empty: "Las fotografías no están disponibles en este momento.", remoteLoading: "Cargando fotografías",
    instagram: "Ver en Instagram", help: "Usa las flechas para cambiar de foto y Escape para cerrar." },
  en: { viewer: "Photo viewer", close: "Close viewer", previous: "Previous photo", next: "Next photo",
    photo: "Photo", open: "Enlarge", loading: "Loading photo", error: "This photo could not be loaded.",
    empty: "Photos are unavailable at the moment.", remoteLoading: "Loading photos",
    instagram: "View on Instagram", help: "Use the arrow keys to change photos and Escape to close." },
};

export function photoLabel(photo: PhotoCard, index: number, lang: "es" | "en") {
  return photo.title && photo.title !== "Instagram photo" ? photo.title : `${galleryLabels[lang].photo} ${index + 1}`;
}

export function PhotoImage({ photo, alt, errorLabel, loadingLabel, sizes, contain = false }: {
  photo: PhotoCard; alt: string; errorLabel: string; loadingLabel: string; sizes: string; contain?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  return (
    <>
      {status !== "error" && <Image src={photo.imageUrl} alt={alt}
        fill sizes={sizes} loading={contain ? "eager" : "lazy"}
        className={contain ? "object-contain" : "object-cover"}
        onLoad={() => setStatus("ready")} onError={() => setStatus("error")} />}
      {status === "loading" && contain && <span className="absolute inset-0 flex items-center justify-center bg-surface-container-high/50 text-sm text-on-surface-variant">
        {loadingLabel}
      </span>}
      {status === "error" && <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-sm text-on-surface-variant" role="status">
        <ImageOff size={24} aria-hidden />{errorLabel}
      </span>}
    </>
  );
}

type PhotoViewerProps = { photos: PhotoCard[]; initialIndex: number; lang: "es" | "en"; viewPostLabel: string; onClose: () => void };

export function PhotoViewer({ photos, initialIndex, lang, viewPostLabel, onClose }: PhotoViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const current = photos[index];
  const text = galleryLabels[lang];
  const change = (step: number) => setIndex((value) => (value + step + photos.length) % photos.length);
  if (!current) return null;

  return (
    <ModalDialog label={text.viewer} lang={lang} onClose={onClose}
      className="photo-dialog fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-surface-container-lowest p-4 text-on-surface sm:p-6">
      <div className="mx-auto flex h-full max-w-7xl flex-col gap-4" onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault(); change(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
        <div className="flex shrink-0 items-center justify-between gap-4">
          <div><span className="block text-sm font-semibold">{text.viewer}</span>
            <span className="sr-only">{text.help}</span></div>
          <button type="button" className="icon-button" aria-label={text.close} onClick={onClose}><X size={22} aria-hidden /></button>
        </div>
        <div className="relative min-h-0 flex-1">
          <PhotoImage key={current.imageUrl} photo={current} alt={photoLabel(current, index, lang)} errorLabel={text.error} loadingLabel={text.loading} contain sizes="(min-width: 1280px) 1200px, 100vw" />
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-outline-variant/50 pt-3">
          <div className="flex items-center gap-2">
            <button type="button" className="icon-button" aria-label={text.previous} disabled={photos.length < 2} onClick={() => change(-1)}>
              <ChevronLeft size={22} aria-hidden />
            </button>
            <span className="min-w-16 text-center font-mono text-sm text-on-surface-variant" aria-live="polite" aria-atomic="true">{index + 1} / {photos.length}</span>
            <button type="button" className="icon-button" aria-label={text.next} disabled={photos.length < 2} onClick={() => change(1)}>
              <ChevronRight size={22} aria-hidden />
            </button>
          </div>
          {current.title && current.title !== "Instagram photo" && <p className="hidden min-w-0 flex-1 truncate text-sm text-on-surface-variant md:block">{current.title}</p>}
          {current.href && <a href={current.href} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-outline-variant px-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-high">
            <InstagramIcon className="h-4 w-4" aria-hidden />{viewPostLabel || text.instagram}
          </a>}
        </div>
      </div>
    </ModalDialog>
  );
}
