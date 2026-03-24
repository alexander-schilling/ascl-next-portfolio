import { describe, expect, it } from "vitest";

import { getLocalizedMetadata } from "@/lib/seo";

describe("getLocalizedMetadata", () => {
  it("uses CMS-provided SEO copy for English", () => {
    const metadata = getLocalizedMetadata("en", {
      title: "CMS Title EN",
      description: "CMS Description EN",
      openGraphDescription: "CMS OG EN",
      siteName: "CMS Site EN",
    });

    expect(metadata.title).toBe("CMS Title EN");
    expect(metadata.description).toBe("CMS Description EN");
    expect(metadata.openGraph?.description).toBe("CMS OG EN");
    expect(metadata.openGraph?.siteName).toBe("CMS Site EN");
    expect(metadata.alternates?.canonical).toBe("http://localhost:3000/en");
    expect(metadata.alternates?.languages?.["x-default"]).toBe("http://localhost:3000");
  });

  it("preserves locale mapping while using CMS SEO copy for Spanish", () => {
    const metadata = getLocalizedMetadata("es", {
      title: "CMS Title ES",
      description: "CMS Description ES",
      openGraphDescription: "CMS OG ES",
      siteName: "CMS Site ES",
    });

    expect(metadata.title).toBe("CMS Title ES");
    expect(metadata.description).toBe("CMS Description ES");
    expect(metadata.openGraph?.description).toBe("CMS OG ES");
    expect(metadata.openGraph?.locale).toBe("es_CL");
  });
});

