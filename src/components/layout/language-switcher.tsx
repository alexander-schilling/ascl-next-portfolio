"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToLanguage = (targetLang: PortfolioLanguage) => {
    if (targetLang === currentLang) {
      return;
    }

    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const search = searchParams.toString();
    const nextHref = buildLocalizedHref({
      pathname,
      targetLang,
      search,
      hash,
    });

    router.push(nextHref);
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
          <button
            key={lang}
            type="button"
            onClick={() => goToLanguage(lang)}
            aria-current={isActive ? "page" : undefined}
            aria-label={currentLang === "es" ? (lang === "es" ? "Idioma español" : "Cambiar a inglés") : (lang === "en" ? "English language" : "Switch to Spanish")}
            className={
              isActive
                ? "min-h-11 min-w-11 cursor-pointer rounded-full bg-primary px-3 text-on-primary"
                : "min-h-11 min-w-11 cursor-pointer rounded-full px-3 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
            }
          >
            {compact ? lang.toUpperCase() : (lang === "en" ? labels.enLabel : labels.esLabel)}
          </button>
        );
      })}
    </div>
  );
}


