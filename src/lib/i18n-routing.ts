import { isSupportedLanguage, type SupportedLanguage } from "@/lib/i18n";

type BuildLocalizedHrefInput = {
  pathname: string;
  targetLang: SupportedLanguage;
  search?: string;
  hash?: string;
};

function normalizeSearch(search?: string) {
  if (!search) {
    return "";
  }

  return search.startsWith("?") ? search : `?${search}`;
}

function normalizeHash(hash?: string) {
  if (!hash) {
    return "";
  }

  return hash.startsWith("#") ? hash : `#${hash}`;
}

function replaceLanguageSegment(pathname: string, targetLang: SupportedLanguage) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${targetLang}`;
  }

  if (isSupportedLanguage(segments[0])) {
    segments[0] = targetLang;
    return `/${segments.join("/")}`;
  }

  return `/${[targetLang, ...segments].join("/")}`;
}

export function buildLocalizedHref({ pathname, targetLang, search, hash }: BuildLocalizedHrefInput) {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return `${replaceLanguageSegment(normalizedPathname, targetLang)}${normalizeSearch(search)}${normalizeHash(hash)}`;
}

