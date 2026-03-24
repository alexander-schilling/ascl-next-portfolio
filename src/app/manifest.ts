import type { MetadataRoute } from "next";

import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { getPortfolioData } from "@/lib/portfolio-api";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { siteContent } = await getPortfolioData(DEFAULT_LANGUAGE);

  return {
    name: siteContent.manifest.name,
    short_name: siteContent.manifest.shortName,
    description: siteContent.manifest.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b1326",
    theme_color: "#0b1326",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

