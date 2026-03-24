import type { Metadata } from "next";

import { isSupportedLanguage } from "@/lib/i18n";
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

  return getLocalizedMetadata(lang);
}

export default async function LocalizedLayout({ children }: LocalizedLayoutProps) {
  return children;
}

