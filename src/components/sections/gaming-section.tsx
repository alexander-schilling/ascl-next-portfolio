import Image from "next/image";
import { DiscordIcon, WebIcon, InstagramIcon } from "@/components/ui/social-icons";
import { CtaLink } from "@/components/ui/cta-link";
import { RevealWrapper } from "@/components/ui/reveal-wrapper";
import { SectionIntro } from "@/components/ui/section-intro";
import { SectionShell } from "@/components/ui/section-shell";
import { ContentIcon, getSectionIconTone } from "@/lib/content-icons";
import type { GamingContent } from "@/types/portfolio";

type GamingSectionProps = {
  content: GamingContent;
};

export function GamingSection({ content }: GamingSectionProps) {
  return (
    <SectionShell id="gaming" className="bg-surface">
      <RevealWrapper>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-surface-container-low p-8 md:p-16">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 opacity-10">
            <Image src={content.imageUrl} alt="" fill className="object-cover grayscale" sizes="33vw" />
          </div>

            <div className="relative z-10 flex flex-col gap-16 lg:grid lg:grid-cols-2 lg:items-center">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface shadow-2xl md:hidden">
                <Image src={content.imageUrl} alt="" fill className="object-cover opacity-80" sizes="100vw" />
              </div>

              <div className="lg:order-1">
              <SectionIntro
                title={
                  <span className="inline-flex items-center gap-4">
                    <ContentIcon iconKey={content.iconKey} fallbackIconKey="joystick" className={["h-8 w-8", getSectionIconTone(content.iconKey)].join(" ")} aria-hidden={true} />
                    <span>{content.heading}</span>
                  </span>
                }
                description={content.description}
                className="mb-8"
              />

              <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                {content.stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-surface-container p-4">
                    <h4 className="mb-1 font-bold text-tertiary">{stat.label}</h4>
                    <p className="text-sm text-on-surface-variant">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                {content.links.map((link, index) => (
                  <CtaLink
                    key={link.label}
                    href={link.href}
                    variant={index === 0 ? "primary" : "secondary"}
                    className="rounded-xl px-6 py-3 inline-flex items-center gap-2"
                  >
                    {(link.identifier === "hispano_discord" || link.label === "Discord") && <DiscordIcon className="h-4 w-4" />}
                    {(link.identifier === "hispano_web" || link.label === "Website") && <WebIcon className="h-4 w-4" />}
                    {(link.identifier === "hispano_instagram" || link.label === "Instagram") && <InstagramIcon className="h-4 w-4" />}
                    {link.label}
                  </CtaLink>
                ))}
              </div>
            </div>

              <div className="relative aspect-video overflow-hidden rounded-2xl bg-surface shadow-2xl hidden md:block lg:order-2">
              <Image src={content.imageUrl} alt="" fill className="object-cover opacity-80" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
          </div>
        </div>
      </RevealWrapper>
    </SectionShell>
  );
}

