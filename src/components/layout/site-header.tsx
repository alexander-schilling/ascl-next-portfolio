import { Suspense } from "react";
import Image from "next/image";

import type { LanguageSwitcherContent, NavLink } from "@/types/portfolio";

import { CtaLink } from "@/components/ui/cta-link";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ScrollSpyNavLinks } from "@/components/layout/scroll-spy-nav-links";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

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
    <header className="site-header fixed top-0 w-full border-b border-outline-variant/30 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[79px] w-full max-w-7xl items-center justify-between gap-1 px-4 sm:gap-3 sm:px-8">
        <a
          href="#"
          aria-label={brand}
          className="flex min-h-11 min-w-11 shrink-0 items-center font-headline text-xl font-bold tracking-tighter text-on-surface transition-colors hover:text-primary"
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
        <nav aria-label={currentLang === "es" ? "Navegación principal" : "Main navigation"} className="hidden items-center gap-7 font-headline text-sm font-bold tracking-tight lg:flex">
          <ScrollSpyNavLinks links={links} />
          <Suspense fallback={<span className="text-slate-400">{languageSwitcher.enLabel} / {languageSwitcher.esLabel}</span>}>
            <LanguageSwitcher currentLang={currentLang} labels={languageSwitcher} />
          </Suspense>
        </nav>
        <div className="flex items-center gap-1 sm:gap-3">
          <div className="lg:hidden">
            <Suspense fallback={<span className="text-[10px] text-slate-400">EN / ES</span>}>
              <LanguageSwitcher currentLang={currentLang} labels={languageSwitcher} compact />
            </Suspense>
          </div>
          <CtaLink href={resumeUrl} size="sm" className="uppercase tracking-widest" target="_blank" rel="noopener noreferrer">
            {resumeLabel}
          </CtaLink>
          <MobileNavigation links={links} lang={currentLang} />
        </div>
      </div>
    </header>
  );
}

