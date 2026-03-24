import type { Metadata } from "next";

import { getSiteUrl } from "@/lib/site";
import type { SupportedLanguage } from "@/lib/i18n";

const LOCALIZED_SEO = {
  en: {
    title: "Alexander | Data Engineering Portfolio",
    description: "Alexander's portfolio: Data Engineering Tech Lead, distributed systems architecture, and personal projects.",
    openGraphDescription: "Systems at scale, technical leadership, and creativity beyond the terminal.",
    locale: "en_US",
  },
  es: {
    title: "Alexander | Portafolio de Data Engineering",
    description: "Portafolio de Alexander: Data Engineering Tech Lead, arquitectura de sistemas distribuidos y proyectos personales.",
    openGraphDescription: "Sistemas a escala, liderazgo técnico y creatividad fuera de la terminal.",
    locale: "es_CL",
  },
} as const;

export function getLocalizedMetadata(lang: SupportedLanguage): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/${lang}`;
  const seo = LOCALIZED_SEO[lang];

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: {
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        "x-default": `${siteUrl}/en`,
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.openGraphDescription,
      url: canonical,
      locale: seo.locale,
      type: "website",
      siteName: "Alexander Portfolio",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

