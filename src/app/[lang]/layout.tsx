import type { Metadata } from "next";

import { isSupportedLanguage } from "@/lib/i18n";
import { getPortfolioData } from "@/lib/portfolio-api";
import { getLocalizedMetadata } from "@/lib/seo";

// Matches the dynamic strategy of page.tsx so that generateMetadata also reads
// PORTFOLIO_API_BASE_URL from the runtime environment.
export const dynamic = "force-dynamic";

type LocalizedLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LocalizedLayoutProps): Promise<Metadata> {
  const { lang } = await params;

  if (!isSupportedLanguage(lang)) {
    return {};
  }

  const { siteContent } = await getPortfolioData(lang);

  return getLocalizedMetadata(lang, siteContent.seo);
}

export default async function LocalizedLayout({ children }: LocalizedLayoutProps) {
  return children;
}

