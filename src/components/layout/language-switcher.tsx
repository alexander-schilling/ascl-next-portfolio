"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { buildLocalizedHref } from "@/lib/i18n-routing";
import type { PortfolioLanguage } from "@/types/portfolio-api";

type LanguageSwitcherProps = {
  currentLang: PortfolioLanguage;
};

const SUPPORTED_LANGUAGES: PortfolioLanguage[] = ["en", "es"];

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
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
    <span className="text-slate-400">
      {SUPPORTED_LANGUAGES.map((lang, index) => (
        <span key={lang}>
          <button
            type="button"
            onClick={() => goToLanguage(lang)}
            aria-current={lang === currentLang ? "page" : undefined}
            className={lang === currentLang ? "text-indigo-400" : "hover:text-slate-100"}
          >
            {lang.toUpperCase()}
          </button>
          {index < SUPPORTED_LANGUAGES.length - 1 ? " / " : null}
        </span>
      ))}
    </span>
  );
}


