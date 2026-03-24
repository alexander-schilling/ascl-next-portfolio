import { Suspense } from "react";

import type { NavLink } from "@/types/portfolio";

import { CtaLink } from "@/components/ui/cta-link";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

type SiteHeaderProps = {
  brand: string;
  links: NavLink[];
  resumeUrl: string;
  currentLang: "en" | "es";
};

export function SiteHeader({ brand, links, resumeUrl, currentLang }: SiteHeaderProps) {
  return (
    <nav className="fixed top-0 z-50 w-full bg-slate-950/60 shadow-[0_12px_40px_rgba(218,226,253,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-8">
        <a
          href="#"
          className="font-headline text-xl font-bold tracking-tighter text-slate-100 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        >
          {brand}
        </a>
        <div className="hidden items-center gap-8 font-headline text-sm font-bold tracking-tight md:flex">
          {links.map((link, index) => (
            <a
              key={link.href}
              className={
                index === 0
                  ? "border-b-2 border-indigo-400 pb-1 text-indigo-400"
                  : "text-slate-400 transition-colors hover:text-slate-100"
              }
              href={link.href}
            >
              {link.label}
            </a>
          ))}
          <Suspense fallback={<span className="text-slate-400">EN / ES</span>}>
            <LanguageSwitcher currentLang={currentLang} />
          </Suspense>
        </div>
        <CtaLink href={resumeUrl} className="px-6 py-2 text-xs uppercase tracking-widest active:scale-95">
          Resume
        </CtaLink>
      </div>
    </nav>
  );
}

