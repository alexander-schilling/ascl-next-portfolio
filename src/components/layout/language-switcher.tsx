"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { buildLocalizedHref } from "@/lib/i18n-routing";
import type { LanguageSwitcherContent } from "@/types/portfolio";
import type { PortfolioLanguage } from "@/types/portfolio-api";

type LanguageSwitcherProps = {
  currentLang: PortfolioLanguage;
  labels: LanguageSwitcherContent;
};

const SUPPORTED_LANGUAGES: PortfolioLanguage[] = ["en", "es"];

export function LanguageSwitcher({ currentLang, labels }: LanguageSwitcherProps) {
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
      className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/70 p-1 text-xs font-bold uppercase tracking-widest"
      role="group"
      aria-label="Language selector"
    >
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isActive = lang === currentLang;

        return (
          <button
            key={lang}
            type="button"
            onClick={() => goToLanguage(lang)}
            aria-current={isActive ? "page" : undefined}
            className={
              isActive
                ? "cursor-pointer rounded-full bg-indigo-500 px-3 py-1 text-white"
                : "cursor-pointer rounded-full px-3 py-1 text-slate-300 transition-colors hover:text-white"
            }
          >
            {lang === "en" ? labels.enLabel : labels.esLabel}
          </button>
        );
      })}
    </div>
  );
}


