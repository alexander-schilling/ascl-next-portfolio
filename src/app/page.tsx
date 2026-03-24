import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { GamingSection } from "@/components/sections/gaming-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PassionsSection } from "@/components/sections/passions-section";
import { siteContent } from "@/data/portfolio";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background font-body selection:bg-primary/30">
      <SiteHeader brand={siteContent.brand} links={siteContent.navLinks} resumeUrl={siteContent.resumeUrl} />
      <main className="flex-1">
        <HeroSection content={siteContent.hero} />
        <AboutSection content={siteContent.about} />
        <ExperienceSection items={siteContent.experience} />
        <PassionsSection content={siteContent.passions} />
        <GamingSection content={siteContent.gaming} />
        <ContactSection content={siteContent.contact} />
      </main>
      <SiteFooter brand={siteContent.brand} links={siteContent.footerLinks} />
    </div>
  );
}
