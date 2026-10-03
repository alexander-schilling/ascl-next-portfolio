import snapshot from "./portfolio-fallback.json";
import type { SiteContent } from "@/types/portfolio";
import type { PortfolioLanguage } from "@/types/portfolio-api";

/**
 * Public CMS snapshot captured on 2026-10-03. Refresh this alongside content
 * changes. Instagram URLs are intentionally excluded because they expire.
 */
const localizedContent = snapshot as Record<PortfolioLanguage, SiteContent>;

export const siteContent: SiteContent = localizedContent.en;

export function getFallbackSiteContent(lang: PortfolioLanguage): SiteContent {
  return localizedContent[lang];
}
