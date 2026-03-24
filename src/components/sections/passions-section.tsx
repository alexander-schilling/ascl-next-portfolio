import Image from "next/image";

import { SectionIntro } from "@/components/ui/section-intro";
import { SectionShell } from "@/components/ui/section-shell";
import type { PassionContent } from "@/types/portfolio";

type PassionsSectionProps = {
  content: PassionContent;
};

export function PassionsSection({ content }: PassionsSectionProps) {
  return (
    <SectionShell id="passions" className="overflow-hidden bg-surface-container-low">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionIntro title={content.heading} description={content.description} />
          <a
            href={content.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-2 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            {content.instagramHandle}
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-fr md:min-h-[500px]">
          {content.gallery.map((photo) => (
            <article
              key={photo.imageUrl}
              className={photo.featured ? "group relative overflow-hidden rounded-2xl md:col-span-2" : "group relative overflow-hidden rounded-2xl"}
            >
              <div className="relative h-72 md:h-full">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(min-width: 768px) 25vw, 100vw"
                />
              </div>
              {photo.featured ? (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="font-medium text-white">{photo.title}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
    </SectionShell>
  );
}

