import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { GamingSection } from "@/components/sections/gaming-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PassionsSection } from "@/components/sections/passions-section";
import { MissingContentAlert } from "@/components/ui/missing-content-alert";
import { SUPPORTED_LANGUAGES, isSupportedLanguage } from "@/lib/i18n";
import { getPortfolioData } from "@/lib/portfolio-api";

type LocalizedHomeProps = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function LocalizedHome({ params }: LocalizedHomeProps) {
  const { lang } = await params;

  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  const { siteContent, diagnostics } = await getPortfolioData(lang);

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background font-body selection:bg-primary/30">
      <MissingContentAlert diagnostics={diagnostics} />
      <SiteHeader
        brand={siteContent.brand}
        links={siteContent.navLinks}
        resumeUrl={siteContent.resumeUrl}
        resumeLabel={siteContent.resumeLabel}
        languageSwitcher={siteContent.languageSwitcher}
        currentLang={lang}
      />
      <main className="flex-1">
        <HeroSection content={siteContent.hero} />
        <AboutSection content={siteContent.about} />
        <ExperienceSection
          items={siteContent.experience}
          eyebrow={siteContent.experienceSection.eyebrow}
          title={siteContent.experienceSection.title}
          highlightedTitle={siteContent.experienceSection.highlightedTitle}
          description={siteContent.experienceSection.description}
          showMoreLabel={siteContent.experienceShowMoreLabel}
        />
        <PassionsSection content={siteContent.passions} />
        <GamingSection content={siteContent.gaming} />
        <ContactSection content={siteContent.contact} />
      </main>
      <SiteFooter brand={siteContent.footerBrand} note={siteContent.footerNote} links={siteContent.footerLinks} />
    </div>
  );
}




