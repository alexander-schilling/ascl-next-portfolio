import { DEFAULT_LANGUAGE, isSupportedLanguage, type SupportedLanguage } from "@/lib/i18n";

export const LANGUAGE_COOKIE_NAME = "preferred-language";
const ACCEPT_LANGUAGE_SEPARATOR_REGEX = /\s*,\s*/;
const QUALITY_VALUE_REGEX = /^q=([01](?:\.\d{1,3})?)$/;
const SPANISH_SPEAKING_COUNTRY_CODES = new Set([
  "AR",
  "BO",
  "CL",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "ES",
  "GQ",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "SV",
  "UY",
  "VE",
]);

type ResolvePreferredLanguageInput = {
  cookieLang?: string | null;
  acceptLanguage?: string | null;
  countryCode?: string | null;
  fallbackLang?: SupportedLanguage;
};

type AcceptLanguagePreference = {
  lang: SupportedLanguage;
  quality: number;
};

export function getSupportedLanguageFromCookie(value?: string | null): SupportedLanguage | undefined {
  if (!value || !isSupportedLanguage(value)) {
    return undefined;
  }

  return value;
}

export function getSupportedLanguageFromCountry(countryCode?: string | null): SupportedLanguage | undefined {
  if (!countryCode) {
    return undefined;
  }

  return SPANISH_SPEAKING_COUNTRY_CODES.has(countryCode.toUpperCase()) ? "es" : undefined;
}

function parseAcceptLanguageEntry(entry: string): AcceptLanguagePreference | undefined {
  const [rawLocale, ...rawParams] = entry.split(";").map((part) => part.trim()).filter(Boolean);

  if (!rawLocale || rawLocale === "*") {
    return undefined;
  }

  const baseLanguage = rawLocale.toLowerCase().split("-")[0];

  if (!isSupportedLanguage(baseLanguage)) {
    return undefined;
  }

  const quality = rawParams.reduce((currentQuality, param) => {
    const match = param.match(QUALITY_VALUE_REGEX);

    if (!match) {
      return currentQuality;
    }

    const parsedQuality = Number.parseFloat(match[1]);
    return Number.isFinite(parsedQuality) ? parsedQuality : currentQuality;
  }, 1);

  return {
    lang: baseLanguage,
    quality,
  };
}

export function getSupportedLanguageFromAcceptLanguage(header?: string | null): SupportedLanguage | undefined {
  if (!header) {
    return undefined;
  }

  const bestMatch = header
    .split(ACCEPT_LANGUAGE_SEPARATOR_REGEX)
    .map((entry) => parseAcceptLanguageEntry(entry))
    .filter((entry): entry is AcceptLanguagePreference => Boolean(entry))
    .sort((left, right) => right.quality - left.quality)[0];

  return bestMatch?.lang;
}

export function getLanguageFromLocalizedPathname(pathname: string): SupportedLanguage | undefined {
  const [firstSegment] = pathname.split("/").filter(Boolean);
  return firstSegment && isSupportedLanguage(firstSegment) ? firstSegment : undefined;
}

export function resolvePreferredLanguage({
  cookieLang,
  acceptLanguage,
  countryCode,
  fallbackLang = DEFAULT_LANGUAGE,
}: ResolvePreferredLanguageInput = {}): SupportedLanguage {
  return getSupportedLanguageFromCookie(cookieLang)
    ?? getSupportedLanguageFromAcceptLanguage(acceptLanguage)
    ?? getSupportedLanguageFromCountry(countryCode)
    ?? fallbackLang;
}

