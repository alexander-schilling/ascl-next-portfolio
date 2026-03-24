"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { SectionIntro } from "@/components/ui/section-intro";
import { SectionShell } from "@/components/ui/section-shell";
import type { ExperienceEntry } from "@/types/portfolio";

type ExperienceSectionProps = {
  items: ExperienceEntry[];
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
};

export function ExperienceSection({ items, eyebrow, title, highlightedTitle, description }: ExperienceSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleItems = useMemo(
    () => (showAll ? items : items.filter((item) => !item.hidden)),
    [items, showAll],
  );

  const hasHiddenItems = items.some((item) => item.hidden);

  return (
    <SectionShell id="experience" className="bg-surface">
        <div className="mb-24 flex flex-col items-end gap-12 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <SectionIntro
              eyebrow={eyebrow}
              title={
                <>
                  <span className="text-primary">{title}</span>
                  <br />
                  <span className="text-on-surface">{highlightedTitle}</span>
                </>
              }
            />
          </div>
          <div className="flex-1 pb-2">
            <p className="max-w-md text-lg leading-relaxed text-on-surface-variant">
              {description}
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="timeline-gradient absolute bottom-0 left-4 top-0 w-[1px] opacity-30 md:left-1/2 md:-translate-x-1/2" />

          {visibleItems.map((item, index) => {
            const isLeftAligned = index % 2 === 0;
            return (
              <article key={`${item.period}-${item.role}`} className="relative mb-16 md:mb-24">
                <div className="absolute left-4 top-10 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-4 border-primary bg-surface-container md:left-1/2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
                  <div className={isLeftAligned ? "md:order-1" : "md:order-2"}>
                    <div className="rounded-xl bg-surface-container-low p-8 shadow-[0_12px_40px_rgba(218,226,253,0.04)] md:ml-10 md:mr-10">
                      <span className="mb-2 block text-sm uppercase tracking-widest text-tertiary">{item.period}</span>
                      <h3 className="mb-1 font-headline text-2xl font-bold text-on-surface">{item.role}</h3>
                      <p className="mb-6 font-medium text-secondary">{item.company}</p>
                      <ul className="space-y-3 text-on-surface-variant">
                        {item.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-tertiary" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={isLeftAligned ? "hidden md:order-2 md:block" : "hidden md:order-1 md:block"}>
                    {item.imageUrl ? (
                      <div className="group relative aspect-video overflow-hidden rounded-xl bg-surface-container-highest shadow-2xl md:mx-10">
                        <Image
                          src={item.imageUrl}
                          alt={`${item.role} visual`}
                          fill
                          className="object-cover opacity-40 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {hasHiddenItems && !showAll ? (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="group relative overflow-hidden rounded-lg bg-surface-container-highest px-10 py-4 text-sm font-bold uppercase tracking-widest text-primary transition-colors hover:bg-surface-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              <span className="relative z-10">View Prior Milestones</span>
            </button>
          </div>
        ) : null}
    </SectionShell>
  );
}

