import Image from "next/image";

import { RevealWrapper } from "@/components/ui/reveal-wrapper";
import { SectionShell } from "@/components/ui/section-shell";
import { ContentIcon, getAboutFeatureIconTone } from "@/lib/content-icons";
import type { AboutContent } from "@/types/portfolio";

type AboutSectionProps = {
  content: AboutContent;
};

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <SectionShell id="about" className="bg-surface-container-low">
      <RevealWrapper>
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative order-1 lg:order-1">
          <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-surface-container-high">
            <Image src={content.portraitUrl} alt={content.heading} fill className="object-cover" sizes="(min-width: 1280px) 568px, (min-width: 1024px) 45vw, 100vw" />
          </div>
          <div className="glass-card absolute bottom-4 left-4 right-4 rounded-xl border border-primary/20 p-5 sm:right-auto">
            <p className="mb-1 text-sm font-bold uppercase tracking-widest text-primary">{content.statusTitle}</p>
            <p className="text-lg font-bold text-on-surface">{content.statusLabel}</p>
          </div>
        </div>

        <div className="order-2 lg:order-2">
          <h2 className="mb-6 font-headline text-3xl font-semibold sm:text-4xl">{content.heading}</h2>
          <div className="space-y-6 text-lg text-on-surface-variant">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2">
            {content.features.map((feature) => (
              <div key={`${feature.title}-${feature.description}`} className="rounded-lg bg-surface-container p-4">
                <div className="flex items-start gap-3">
                  <ContentIcon
                    iconKey={feature.iconKey}
                    fallbackIconKey="curiosity"
                    className={["mt-0.5 h-5 w-5 shrink-0", getAboutFeatureIconTone(feature.iconKey)].join(" ")}
                    aria-hidden={true}
                  />
                  <div>
                    <h3 className="font-bold text-on-surface">{feature.title}</h3>
                    <p className="text-sm text-on-surface-variant">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </RevealWrapper>
    </SectionShell>
  );
}

