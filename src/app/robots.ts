import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

// SITE_URL is supplied to the container, not to the Docker build.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

