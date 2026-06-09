"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

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
  nowLabel: string;
  rolesLabel: string;
};

type ExperienceGroup = {
  company: string;
  companyUrl?: string;
  companyLinkedin?: string;
  imageUrl?: string;
  roles: ExperienceEntry[];
};

/** Group consecutive entries that share the same company name. */
function groupByCompany(items: ExperienceEntry[]): ExperienceGroup[] {
  const groups: ExperienceGroup[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.company === item.company) {
      last.roles.push(item);
      if (!last.imageUrl && item.imageUrl) last.imageUrl = item.imageUrl;
    } else {
      groups.push({
        company: item.company,
        companyUrl: item.companyUrl,
        companyLinkedin: item.companyLinkedin,
        imageUrl: item.imageUrl,
        roles: [item],
      });
    }
  }
  return groups;
}

// ─── Accent system ───────────────────────────────────────────────────────────
// Card-level accent: drives the left border, timeline dot, company name color.
// Role-level accent: drives period text, icon, badge — varies per role index.

type CardAccent = {
  borderLeft: string;
  dot: string;
  dotRing: string;
  glow: string;
  company: string;
  divider: string;
  card: string;
};

type RoleAccent = {
  period: string;
  title: string;
  icon: string;
  badge: string;
  roleDot: string;      // inner mini-timeline dot style
  rowTint: string;      // subtle background tint on the role row
};

function getCardAccent(groupIndex: number, hasImage: boolean): CardAccent {
  if (groupIndex === 0) {
    return {
      borderLeft: "border-l-[3px] border-tertiary",
      dot: "bg-tertiary",
      dotRing: "ring-4 ring-tertiary/15",
      glow: "shadow-[0_8px_32px_rgba(255,183,131,0.06)]",
      company: "text-tertiary",
      divider: "border-outline-variant/12",
      card: "bg-surface-container-low",
    };
  }
  if (hasImage) {
    return {
      borderLeft: "border-l-[3px] border-secondary/40",
      dot: "bg-secondary/70",
      dotRing: "ring-4 ring-secondary/10",
      glow: "",
      company: "text-secondary",
      divider: "border-outline-variant/10",
      card: "bg-surface-container-low",
    };
  }
  return {
    borderLeft: "border-l-[3px] border-outline-variant/20",
    dot: "bg-outline-variant/50",
    dotRing: "ring-4 ring-outline-variant/08",
    glow: "",
    company: "text-outline",
    divider: "border-outline-variant/10",
    card: "bg-surface-container-lowest opacity-80",
  };
}

function getRoleAccent(groupIndex: number, roleIndex: number): RoleAccent {
  // Only groupIndex 0 + roleIndex 0 is "active current"
  if (groupIndex === 0 && roleIndex === 0) {
    return {
      period: "text-tertiary",
      title: "text-on-surface",
      icon: "text-tertiary-fixed-dim",
      badge: "bg-tertiary/10 text-tertiary border border-tertiary/20",
      roleDot: "bg-tertiary ring-2 ring-tertiary/25",
      rowTint: "",
    };
  }
  // Past roles within the active company, or any role in a past company
  return {
    period: "text-outline/60",
    title: "text-on-surface/65",
    icon: "text-outline/45",
    badge: "bg-surface-container text-on-surface-variant/60 border border-outline-variant/15",
    roleDot: "border border-outline-variant/40 bg-transparent",
    rowTint: "",
  };
}

// ─── Role row ─────────────────────────────────────────────────────────────────

type RoleRowProps = {
  item: ExperienceEntry;
  groupIndex: number;
  roleIndex: number;
  isMultiRole: boolean;
  isLastRole: boolean;
  cardAccent: CardAccent;
  nowLabel: string;
};

function RoleRow({ item, groupIndex, roleIndex, isMultiRole, isLastRole, cardAccent, nowLabel }: RoleRowProps) {
  const role = getRoleAccent(groupIndex, roleIndex);
  const isActive = groupIndex === 0 && roleIndex === 0;

  return (
    <div className="relative flex gap-4 px-5 sm:px-6 py-4">
      {/* Inner mini-timeline — only for multi-role grouped cards */}
      {isMultiRole && (
        <div className="flex flex-col items-center pt-0.75 shrink-0" aria-hidden>
          <div className={["h-2.5 w-2.5 rounded-full shrink-0", role.roleDot].join(" ")} />
          {!isLastRole && (
            <div className="mt-1 w-px flex-1 bg-outline-variant/15" />
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Period */}
        <span className={["mb-1 block font-mono text-[11px] font-medium uppercase tracking-[0.15em]", role.period].join(" ")}>
          {item.period}
          {isActive && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-tertiary/12 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-tertiary">
              <span className="h-1 w-1 rounded-full bg-tertiary animate-pulse" />
              {nowLabel}
            </span>
          )}
        </span>

        {/* Role title */}
        <h3 className={["font-headline font-bold leading-tight mb-2", isMultiRole ? "text-base sm:text-lg" : "text-lg sm:text-xl", role.title].join(" ")}>
          {item.role}
        </h3>

        {/* Company row — single-role cards only */}
        {!isMultiRole && (
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span className={["text-sm font-semibold", cardAccent.company].join(" ")}>{item.company}</span>
            {item.companyLinkedin ? (
              <a href={item.companyLinkedin} target="_blank" rel="noreferrer" aria-label={`LinkedIn de ${item.company}`}
                className="opacity-50 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
                <LinkedinIcon className="h-3.5 w-3.5" />
              </a>
            ) : null}
            {item.companyUrl ? (
              <a href={item.companyUrl} target="_blank" rel="noreferrer" aria-label={`Sitio web de ${item.company}`}
                className="opacity-50 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
                <WebIcon className="h-3.5 w-3.5" />
              </a>
            ) : null}
            {item.modality ? (
              <span className={["rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", role.badge].join(" ")}>
                {item.modality}
              </span>
            ) : null}
          </div>
        )}

        {/* Modality badge — multi-role */}
        {isMultiRole && item.modality ? (
          <span className={["mb-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", role.badge].join(" ")}>
            {item.modality}
          </span>
        ) : null}

        {/* Highlights */}
        <ul className={["gap-x-8 gap-y-2", item.highlights.length > 2 ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"].join(" ")}>
          {item.highlights.map((highlight, hi) => (
            <li key={`${highlight.text}-${hi}`} className="flex items-start gap-2 text-sm leading-snug text-on-surface-variant/80">
              <ContentIcon
                iconKey={highlight.iconKey}
                fallbackIconKey="insights"
                className={["mt-0.75 h-3.5 w-3.5 shrink-0", role.icon].join(" ")}
                aria-hidden
              />
              <span className={isActive ? "text-on-surface-variant" : "text-on-surface-variant/60"}>{highlight.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Image thumbnail — single-role cards, desktop only */}
      {!isMultiRole && item.imageUrl ? (
        <div className="hidden sm:block shrink-0">
          <div className="relative h-13 w-22 overflow-hidden rounded-lg bg-surface-container-highest opacity-35 group-hover:opacity-80 transition-opacity duration-500">
            <Image src={item.imageUrl} alt={item.company} fill className="object-cover" sizes="88px" />
          </div>
        </div>
      ) : null}

      {/* Image — single-role mobile */}
      {!isMultiRole && item.imageUrl ? (
        <div className="sm:hidden absolute top-4 right-4">
          <div className="relative h-10 w-16 overflow-hidden rounded-md bg-surface-container-highest opacity-40">
            <Image src={item.imageUrl} alt={item.company} fill className="object-cover" sizes="64px" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export function ExperienceSection({
  items,
  eyebrow,
  title,
  highlightedTitle,
  description,
  showMoreLabel,
  nowLabel,
  rolesLabel,
}: ExperienceSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const revealRef = useReveal<HTMLDivElement>();

  const visibleItems = useMemo(
    () => (showAll ? items : items.filter((item) => !item.hidden)),
    [items, showAll],
  );

  const groups = useMemo(() => groupByCompany(visibleItems), [visibleItems]);
  const hasHiddenItems = items.some((item) => item.hidden);

  return (
    <SectionShell id="experience" className="bg-surface">
      <div ref={revealRef} className="reveal">
        <div className="mb-20 flex flex-col items-center gap-12 text-center md:items-end md:flex-row md:text-left">
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
            <p className="max-w-md text-lg leading-relaxed text-on-surface-variant">{description}</p>
          </div>
        </div>

        <div className="relative ml-4">
          {/* Outer vertical timeline rail */}
          <div className="timeline-gradient absolute -left-4 bottom-0 top-0 w-px opacity-25" />

          <div className="flex flex-col gap-5">
            {groups.map((group, groupIndex) => {
              const cardAccent = getCardAccent(groupIndex, Boolean(group.imageUrl));
              const isMultiRole = group.roles.length > 1;

              return (
                <article
                  key={`${group.company}-${groupIndex}`}
                  className={[
                    "group relative rounded-xl border border-outline-variant/10 transition-all duration-300",
                    "hover:border-outline-variant/20 hover:bg-surface-container",
                    cardAccent.borderLeft,
                    cardAccent.card,
                    cardAccent.glow,
                  ].join(" ")}
                >
                  {/* Timeline dot on the outer rail */}
                  <div className={["absolute -left-6.25 top-5.5 h-3 w-3 -translate-x-px rounded-full", cardAccent.dot, cardAccent.dotRing].join(" ")} />

                  {/* Company header — multi-role cards only */}
                  {isMultiRole && (
                    <div className={["flex items-center justify-between gap-4 px-5 sm:px-6 pt-4 pb-3 border-b", cardAccent.divider].join(" ")}>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={["text-base font-bold tracking-wide", cardAccent.company].join(" ")}>{group.company}</span>
                        {group.companyLinkedin ? (
                          <a href={group.companyLinkedin} target="_blank" rel="noreferrer" aria-label={`LinkedIn de ${group.company}`}
                            className="opacity-50 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
                            <LinkedinIcon className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                        {group.companyUrl ? (
                          <a href={group.companyUrl} target="_blank" rel="noreferrer" aria-label={`Sitio web de ${group.company}`}
                            className="opacity-50 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary">
                            <WebIcon className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                        <span className="text-[10px] text-outline/50 font-mono uppercase tracking-wider">
                          {group.roles.length} {rolesLabel}
                        </span>
                      </div>
                      {group.imageUrl ? (
                        <div className="hidden sm:block shrink-0">
                          <div className="relative h-10 w-17.5 overflow-hidden rounded-md bg-surface-container-highest opacity-30 group-hover:opacity-70 transition-opacity duration-500">
                            <Image src={group.imageUrl} alt={group.company} fill className="object-cover" sizes="70px" />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Role rows */}
                  {group.roles.map((item, roleIndex) => (
                    <div key={`${item.period}-${item.role}`}>
                      {roleIndex > 0 && (
                        <div className={["mx-5 sm:mx-6 border-t", cardAccent.divider].join(" ")} />
                      )}
                      <RoleRow
                        item={item}
                        groupIndex={groupIndex}
                        roleIndex={roleIndex}
                        isMultiRole={isMultiRole}
                        isLastRole={roleIndex === group.roles.length - 1}
                        cardAccent={cardAccent}
                        nowLabel={nowLabel}
                      />
                    </div>
                  ))}
                </article>
              );
            })}
          </div>
        </div>

        {hasHiddenItems && !showAll ? (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-lg bg-surface-container-highest px-10 py-4 text-sm font-bold uppercase tracking-widest text-primary transition-colors hover:bg-surface-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              {showMoreLabel}
            </button>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
