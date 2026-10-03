import type { SupportedLanguage } from "@/lib/i18n";
import { getContactEmail } from "@/lib/public-email";
import { getSiteUrl } from "@/lib/site";
import type { SiteContent } from "@/types/portfolio";

export function getProfileSchema(lang: SupportedLanguage, content: SiteContent) {
  const siteUrl = getSiteUrl();
  const profileUrl = `${siteUrl}/${lang}`;
  const personId = `${siteUrl}/#person`;
  const currentRole = content.experience[0];
  const email = getContactEmail(content.contact);
  const location = content.contact.details.find((detail) =>
    ["Ubicación", "Base"].includes(detail.label))?.value;
  const sameAs = [...new Set([...content.contact.ctas, ...content.footerLinks]
    .map((link) => link.href).filter((href) => /^https:\/\//.test(href)))];

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${profileUrl}#profile`,
    url: profileUrl,
    name: content.seo.title,
    description: content.seo.description,
    inLanguage: lang,
    mainEntity: {
      "@type": "Person",
      "@id": personId,
      name: content.seo.siteName,
      url: siteUrl,
      description: content.seo.description,
      image: content.about.portraitUrl,
      sameAs,
      ...(email ? { email } : {}),
      ...(currentRole ? {
        jobTitle: currentRole.role,
        worksFor: { "@type": "Organization", name: currentRole.company },
      } : {}),
      ...(location ? { homeLocation: { "@type": "Place", name: location } } : {}),
    },
    ...(content.resumeUrl ? {
      subjectOf: { "@type": "DigitalDocument", name: content.resumeLabel, url: content.resumeUrl, inLanguage: lang },
    } : {}),
  };
}

export function serializeProfileSchema(schema: ReturnType<typeof getProfileSchema>) {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
