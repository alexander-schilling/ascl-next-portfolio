import { CtaLink } from "@/components/ui/cta-link";
import { SectionIntro } from "@/components/ui/section-intro";
import { SectionShell } from "@/components/ui/section-shell";
import type { ContactContent } from "@/types/portfolio";

type ContactSectionProps = {
  content: ContactContent;
};

export function ContactSection({ content }: ContactSectionProps) {
  return (
    <SectionShell id="contact" className="bg-surface">
        <div className="relative overflow-hidden rounded-3xl bg-surface-container-high p-12 text-center md:p-20">
          <div className="pointer-events-none absolute inset-0 opacity-5">
            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 mx-auto max-w-3xl">
            <SectionIntro
              align="center"
              title={
                <>
                  {content.heading}
                  <br />
                  <span className="text-secondary">{content.highlighted}</span>
                </>
              }
              description={content.description}
              className="mb-16"
            />

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              {content.ctas.map((cta, index) => (
                <CtaLink
                  key={cta.label}
                  href={cta.href}
                  variant={index === 0 ? "primary" : "ghost"}
                  className="w-full rounded-2xl px-12 py-5 text-xl sm:w-auto"
                >
                  {cta.label}
                </CtaLink>
              ))}
            </div>

            <div className="mt-20 flex flex-wrap justify-center gap-16 pt-12">
              {content.details.map((detail) => (
                <div key={detail.label}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-outline-variant">{detail.label}</p>
                  <p className="text-on-surface">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
    </SectionShell>
  );
}

