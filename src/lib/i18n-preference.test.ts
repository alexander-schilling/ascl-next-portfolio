import { describe, expect, it } from "vitest";

import {
  getLanguageFromLocalizedPathname,
  getSupportedLanguageFromAcceptLanguage,
  getSupportedLanguageFromCountry,
  getSupportedLanguageFromCookie,
  resolvePreferredLanguage,
} from "@/lib/i18n-preference";

describe("i18n-preference", () => {
  it("accepts only supported language cookies", () => {
    expect(getSupportedLanguageFromCookie("es")).toBe("es");
    expect(getSupportedLanguageFromCookie("fr")).toBeUndefined();
  });

  it("picks the highest quality supported browser language", () => {
    expect(getSupportedLanguageFromAcceptLanguage("fr-CA,es-CL;q=0.9,en-US;q=0.8")).toBe("es");
    expect(getSupportedLanguageFromAcceptLanguage("de, en-US;q=0.6, es;q=0.9")).toBe("es");
  });

  it("falls back to geo country when browser languages are unsupported", () => {
    expect(getSupportedLanguageFromCountry("CL")).toBe("es");
    expect(getSupportedLanguageFromCountry("US")).toBeUndefined();
  });

  it("resolves preferred language using cookie, browser, location, then fallback", () => {
    expect(resolvePreferredLanguage({
      cookieLang: "es",
      acceptLanguage: "en-US,en;q=0.9",
      countryCode: "US",
      fallbackLang: "en",
    })).toBe("es");

    expect(resolvePreferredLanguage({
      cookieLang: "fr",
      acceptLanguage: "en-US,en;q=0.9",
      countryCode: "CL",
      fallbackLang: "en",
    })).toBe("en");

    expect(resolvePreferredLanguage({
      cookieLang: null,
      acceptLanguage: "fr-CA,pt-BR;q=0.9",
      countryCode: "CL",
      fallbackLang: "en",
    })).toBe("es");

    expect(resolvePreferredLanguage({
      cookieLang: null,
      acceptLanguage: "fr-CA,pt-BR;q=0.9",
      countryCode: "US",
      fallbackLang: "en",
    })).toBe("en");
  });

  it("detects the localized language segment from the pathname", () => {
    expect(getLanguageFromLocalizedPathname("/es/projects")).toBe("es");
    expect(getLanguageFromLocalizedPathname("/en")).toBe("en");
    expect(getLanguageFromLocalizedPathname("/contact")).toBeUndefined();
  });
});

