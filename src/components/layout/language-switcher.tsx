"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { MouseEvent } from "react";

import { buildLocalizedHref } from "@/lib/i18n-routing";
import type { LanguageSwitcherContent } from "@/types/portfolio";
import type { PortfolioLanguage } from "@/types/portfolio-api";

type LanguageSwitcherProps = {
  currentLang: PortfolioLanguage;
  labels: LanguageSwitcherContent;
  compact?: boolean;
};

const SUPPORTED_LANGUAGES: PortfolioLanguage[] = ["en", "es"];

export function LanguageSwitcher({ currentLang, labels, compact = false }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const preserveHash = (event: MouseEvent<HTMLAnchorElement>) => {
    // The server emits a real link; include the current fragment on activation
    // without preventing native navigation, modified clicks or opening a tab.
    const destination = new URL(event.currentTarget.href);
    destination.hash = window.location.hash;
    event.currentTarget.href = destination.href;
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border border-outline-variant bg-surface-container p-0.5 font-bold uppercase ${compact ? "text-xs tracking-normal" : "text-xs tracking-widest"}`}
      role="group"
      aria-label={currentLang === "es" ? "Selector de idioma" : "Language selector"}
    >
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isActive = lang === currentLang;

        return (
          <a
            key={lang}
            href={buildLocalizedHref({ pathname, targetLang: lang, search: searchParams.toString() })}
            onClick={preserveHash}
            hrefLang={lang}
            lang={lang}
            aria-current={isActive ? "page" : undefined}
            aria-label={currentLang === "es" ? (lang === "es" ? "Idioma español" : "Cambiar a inglés") : (lang === "en" ? "English language" : "Switch to Spanish")}
            className={
              isActive
                ? "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-primary px-3 text-on-primary"
                : "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-3 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            }
          >
            {compact ? lang.toUpperCase() : (lang === "en" ? labels.enLabel : labels.esLabel)}
          </a>
        );
      })}
    </div>
  );
}


