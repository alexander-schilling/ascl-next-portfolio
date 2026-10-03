import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";

// Resolve the public origin at runtime, like the localized page metadata.
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  // List canonical pages, not the root redirect. Do not invent a lastmod date
  // from request/build time: the CMS does not expose a content revision here.
  return SUPPORTED_LANGUAGES.map((lang) => ({
    url: `${siteUrl}/${lang}`,
    changeFrequency: "monthly",
    priority: 1,
    alternates: {
      languages: {
        en: `${siteUrl}/en`,
        es: `${siteUrl}/es`,
        "x-default": siteUrl,
      },
    },
  }));
}

