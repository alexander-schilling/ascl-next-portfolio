import { Suspense } from "react";
import Image from "next/image";

import type { LanguageSwitcherContent, NavLink } from "@/types/portfolio";

import { CtaLink } from "@/components/ui/cta-link";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ScrollSpyNavLinks } from "@/components/layout/scroll-spy-nav-links";

type SiteHeaderProps = {
  brand: string;
  brandLogoUrl: string;
  links: NavLink[];
  resumeUrl: string;
  resumeLabel: string;
  languageSwitcher: LanguageSwitcherContent;
  currentLang: "en" | "es";
};

export function SiteHeader({
  brand,
  brandLogoUrl,
  links,
  resumeUrl,
  resumeLabel,
  languageSwitcher,
  currentLang,
}: SiteHeaderProps) {
  return (
    <nav className="fixed top-0 z-50 w-full bg-slate-950/60 shadow-[0_12px_40px_rgba(218,226,253,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-8">
        <a
          href="#"
          aria-label={brand}
          className="flex items-center font-headline text-xl font-bold tracking-tighter text-slate-100 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        >
          {brandLogoUrl
            ? (
                <Image
                  src={brandLogoUrl}
                  alt={`${brand} logo`}
                  width={140}
                  height={40}
                  className="h-8 w-auto object-contain"
                  sizes="140px"
                />
              )
            : brand}
        </a>
        <div className="hidden items-center gap-8 font-headline text-sm font-bold tracking-tight md:flex">
          <ScrollSpyNavLinks links={links} />
          <Suspense fallback={<span className="text-slate-400">{languageSwitcher.enLabel} / {languageSwitcher.esLabel}</span>}>
            <LanguageSwitcher currentLang={currentLang} labels={languageSwitcher} />
          </Suspense>
        </div>
        <CtaLink href={resumeUrl} className="px-6 py-2 text-xs uppercase tracking-widest active:scale-95" target="_blank" rel="noopener noreferrer">
          {resumeLabel}
        </CtaLink>
      </div>
    </nav>
  );
}

