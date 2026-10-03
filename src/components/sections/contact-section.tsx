import { LinkedinIcon, GithubIcon, MailIcon } from "@/components/ui/social-icons";
import { CtaLink } from "@/components/ui/cta-link";
import { RevealWrapper } from "@/components/ui/reveal-wrapper";
import { SectionIntro } from "@/components/ui/section-intro";
import { SectionShell } from "@/components/ui/section-shell";
import type { ContactContent } from "@/types/portfolio";

export function ContactSection({ content }: { content: ContactContent }) {
  return (
    <SectionShell id="contact" className="bg-surface">
      <RevealWrapper>
        <div className="border-t border-outline-variant/50 pt-12 text-center sm:pt-16">
          <div className="mx-auto max-w-3xl">
            <SectionIntro align="center" title={
              <>{content.heading}<br /><span className="text-primary">{content.highlighted}</span></>
            } description={content.description} className="mb-8" />
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              {content.ctas.map((cta, index) => (
                <CtaLink key={cta.label} href={cta.href} variant={index === 0 ? "primary" : "secondary"}
                  className="w-full gap-2 px-7 py-3.5 text-base sm:w-auto">
                  {cta.label === "Email" && <MailIcon className="h-5 w-5" aria-hidden />}
                  {cta.label === "LinkedIn" && <LinkedinIcon className="h-5 w-5" aria-hidden />}
                  {cta.label === "GitHub" && <GithubIcon className="h-5 w-5" aria-hidden />}
                  {cta.label}
                </CtaLink>
              ))}
            </div>
            <dl className="mt-12 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap sm:gap-12">
              {content.details.map((detail) => (
                <div key={detail.label}>
                  <dt className="mb-2 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{detail.label}</dt>
                  <dd className="text-on-surface">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </RevealWrapper>
    </SectionShell>
  );
}
