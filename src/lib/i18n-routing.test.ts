import { describe, expect, it } from "vitest";

import { buildLocalizedHref } from "@/lib/i18n-routing";

describe("buildLocalizedHref", () => {
  it("replaces the leading language segment and preserves search/hash", () => {
    expect(
      buildLocalizedHref({
        pathname: "/en/projects",
        targetLang: "es",
        search: "utm_source=linkedin&ref=portfolio",
        hash: "#contact",
      }),
    ).toBe("/es/projects?utm_source=linkedin&ref=portfolio#contact");
  });

  it("prepends the language when the pathname has no locale", () => {
    expect(
      buildLocalizedHref({
        pathname: "/about",
        targetLang: "en",
        search: "?tab=story",
      }),
    ).toBe("/en/about?tab=story");
  });

  it("handles root navigation without duplicating separators", () => {
    expect(
      buildLocalizedHref({
        pathname: "/",
        targetLang: "es",
      }),
    ).toBe("/es");
  });
});

