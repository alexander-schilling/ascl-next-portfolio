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
      <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
        <div className="relative order-1 lg:order-1">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-surface-container-high shadow-2xl">
            <Image src={content.portraitUrl} alt={content.heading} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
          <div className="glass-card absolute -left-6 -top-6 rounded-2xl border border-primary/20 p-6 shadow-xl">
            <p className="mb-1 text-sm font-bold uppercase tracking-widest text-primary">{content.statusTitle}</p>
            <p className="text-lg font-bold text-on-surface">{content.statusLabel}</p>
          </div>
        </div>

        <div className="order-2 lg:order-2">
          <h2 className="mb-8 font-headline text-4xl font-bold">{content.heading}</h2>
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
                    <h4 className="font-bold text-on-surface">{feature.title}</h4>
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

