import type { Metadata } from "next";

import { isSupportedLanguage } from "@/lib/i18n";
import { getPortfolioData } from "@/lib/portfolio-api";
import { getLocalizedMetadata } from "@/lib/seo";

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

