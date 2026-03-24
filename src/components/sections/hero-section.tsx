import Image from "next/image";

import { CtaLink } from "@/components/ui/cta-link";
import type { HeroContent } from "@/types/portfolio";

type HeroSectionProps = {
  content: HeroContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src={content.backgroundImageUrl}
          alt="Atmospheric workspace"
          fill
          className="scale-105 object-cover opacity-15"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl px-8 text-center md:text-left">
        <div className="mx-auto max-w-4xl md:mx-0">
          <span className="mb-6 inline-block rounded bg-primary/10 px-3 py-1 text-sm font-bold uppercase tracking-widest text-primary">
            {content.badge}
          </span>
          <h1 className="mb-8 font-headline text-5xl font-bold leading-[1.1] tracking-tighter text-on-background md:text-8xl">
            {content.title}
            <br />
            <span className="italic text-secondary">{content.highlightedTitle}</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-on-surface-variant md:mx-0">
            {content.subtitle}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
            <CtaLink href={content.primaryCta.href} className="px-8 py-4 text-sm sm:text-base">
              {content.primaryCta.label}
            </CtaLink>
            <CtaLink href={content.secondaryCta.href} variant="secondary" className="px-8 py-4 text-sm sm:text-base">
              {content.secondaryCta.label}
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}

