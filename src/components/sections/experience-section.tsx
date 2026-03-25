"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { SectionIntro } from "@/components/ui/section-intro";
import { SectionShell } from "@/components/ui/section-shell";
import { LinkedinIcon, WebIcon } from "@/components/ui/social-icons";
import { ContentIcon } from "@/lib/content-icons";
import type { ExperienceEntry } from "@/types/portfolio";

type ExperienceSectionProps = {
  items: ExperienceEntry[];
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  showMoreLabel: string;
};

function getExperienceAccent(index: number, hasImage: boolean) {
  if (index === 0) {
    return {
      card: "border-l-4 border-tertiary bg-surface-container-low",
      period: "text-tertiary",
      company: "text-secondary",
      icon: "text-tertiary-fixed-dim",
      nodeBorder: "border-tertiary",
      nodeDot: "bg-tertiary",
    };
  }

  if (hasImage) {
    return {
      card: "border-secondary bg-surface-container",
      period: "text-outline",
      company: "text-secondary",
      icon: "text-secondary",
      nodeBorder: "border-secondary",
      nodeDot: "bg-secondary",
    };
  }

  return {
    card: "border border-outline-variant/15 bg-surface-container-lowest opacity-70",
    period: "text-outline",
    company: "text-outline",
    icon: "text-outline",
    nodeBorder: "border-outline-variant/30",
    nodeDot: "bg-outline-variant/40",
  };
}

export function ExperienceSection({ items, eyebrow, title, highlightedTitle, description, showMoreLabel }: ExperienceSectionProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleItems = useMemo(
    () => (showAll ? items : items.filter((item) => !item.hidden)),
    [items, showAll],
  );

  const hasHiddenItems = items.some((item) => item.hidden);

  return (
    <SectionShell id="experience" className="bg-surface">
        <div className="mb-24 flex flex-col items-center gap-12 text-center md:items-end md:flex-row md:text-left">
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
            const accent = getExperienceAccent(index, Boolean(item.imageUrl));

            return (
              <article key={`${item.period}-${item.role}`} className="relative mb-16 md:mb-24">
                <div
                  className={[
                    "absolute left-4 top-10 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-surface-container md:left-1/2",
                    accent.nodeBorder,
                    index === 0 ? "border-4 shadow-[0_0_20px_rgba(255,183,131,0.2)]" : "border-4",
                  ].join(" ")}
                >
                  <span className={["h-2 w-2 rounded-full", accent.nodeDot].join(" ")} />
                </div>

                {item.imageUrl && (
                  <div className="md:hidden mb-6">
                    <div className="group relative aspect-video overflow-hidden rounded-xl bg-surface-container-highest shadow-2xl">
                      <Image
                        src={item.imageUrl}
                        alt={item.role}
                        fill
                        className="object-cover opacity-100 md:opacity-40 transition-all duration-500 group-hover:opacity-100"
                        sizes="100vw"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
                  <div className={isLeftAligned ? "md:order-1" : "md:order-2"}>
                    <div
                      className={[
                        "rounded-xl p-8 shadow-[0_12px_40px_rgba(218,226,253,0.04)] md:ml-10 md:mr-10",
                        accent.card,
                        isLeftAligned ? "md:text-right" : "md:text-left",
                      ].join(" ")}
                    >
                      <span className={["mb-2 block text-sm uppercase tracking-widest", accent.period].join(" ")}>{item.period}</span>
                      <h3 className="mb-1 font-headline text-2xl font-bold text-on-surface">{item.role}</h3>
                      <div
                        className={[
                          "mb-6 flex items-center gap-3",
                          accent.company,
                          isLeftAligned ? "md:justify-end" : "md:justify-start",
                        ].join(" ")}
                      >
                        <p className="font-medium">{item.company}</p>

                        {item.companyLinkedin ? (
                          <a
                            href={item.companyLinkedin}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`LinkedIn de ${item.company}`}
                            className="transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                          >
                            <LinkedinIcon className="h-4 w-4" />
                          </a>
                        ) : null}

                        {item.companyUrl ? (
                          <a
                            href={item.companyUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Sitio web de ${item.company}`}
                            className="transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                          >
                            <WebIcon className="h-4 w-4" />
                          </a>
                        ) : null}

                        {item.modality ? (
                          <span className="rounded-full bg-surface-container-highest px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                            {item.modality}
                          </span>
                        ) : null}
                      </div>
                      <ul className="space-y-3 text-on-surface-variant">
                        {item.highlights.map((highlight, index) => (
                          <li
                            key={`${highlight.text}-${index}-${highlight.iconKey ?? "default"}`}
                            className={[
                              "flex items-start gap-3",
                              isLeftAligned ? "md:flex-row-reverse md:text-right" : "md:text-left",
                            ].join(" ")}
                          >
                            <ContentIcon
                              iconKey={highlight.iconKey}
                              fallbackIconKey="insights"
                              className={["mt-1 h-4 w-4 shrink-0", accent.icon].join(" ")}
                              aria-hidden={true}
                            />
                            <span>{highlight.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {item.imageUrl ? (
                      <div className={`hidden md:block ${isLeftAligned ? "md:order-2" : "md:order-1"}`}>
                      <div className="group relative aspect-video overflow-hidden rounded-xl bg-surface-container-highest shadow-2xl md:mx-10">
                        <Image
                          src={item.imageUrl}
                          alt={item.role}
                          fill
                          className="object-cover opacity-40 transition-all duration-500 group-hover:opacity-100"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                      </div>
                    </div>
                  ) : null}
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
              <span className="relative z-10">{showMoreLabel}</span>
            </button>
          </div>
        ) : null}
    </SectionShell>
  );
}

