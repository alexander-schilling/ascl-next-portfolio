import type { Metadata } from "next";

import { getSiteUrl } from "@/lib/site";
import type { SupportedLanguage } from "@/lib/i18n";
import type { SeoContent } from "@/types/portfolio";

export function getLocalizedMetadata(lang: SupportedLanguage, seo: SeoContent): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/${lang}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        "x-default": siteUrl,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.openGraphDescription,
      url: canonical,
      locale: lang === "es" ? "es_CL" : "en_US",
      type: "website",
      siteName: seo.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

