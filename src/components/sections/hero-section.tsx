import Image from "next/image";
import { CtaLink } from "@/components/ui/cta-link";
import type { HeroContent } from "@/types/portfolio";

export function HeroSection({ content }: { content: HeroContent }) {
  return (
    <section className="relative flex min-h-[min(54rem,100svh)] items-center overflow-hidden pt-24 pb-16 sm:pb-20">
      <div className="absolute inset-0">
        <Image src={content.backgroundImageUrl} alt="" fill preload
          className="object-cover object-center opacity-25" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8">
        <span className="mb-6 block text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:text-sm">
          {content.badge}
        </span>
        <h1 className="hero-title mb-7 font-headline font-semibold tracking-tight text-on-background">
          <span className="block">{content.title}</span>
          <span className="block pb-1 italic text-primary">{content.highlightedTitle}</span>
        </h1>
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg">
          {content.subtitle}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <CtaLink href={content.primaryCta.href} className="px-7 py-3.5 text-base">
            {content.primaryCta.label}
          </CtaLink>
          <CtaLink href={content.secondaryCta.href} variant="secondary" className="px-7 py-3.5 text-base">
            {content.secondaryCta.label}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
