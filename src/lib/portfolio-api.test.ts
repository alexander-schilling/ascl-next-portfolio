import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { siteContent as fallbackSiteContent } from "@/data/portfolio";
import { getPortfolioData } from "@/lib/portfolio-api";

describe("getPortfolioData", () => {
  const originalBaseUrl = process.env.PORTFOLIO_API_BASE_URL;

  beforeEach(() => {
    process.env.PORTFOLIO_API_BASE_URL = "https://cms.alexanderschilling.cl/api";
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    process.env.PORTFOLIO_API_BASE_URL = originalBaseUrl;
    vi.restoreAllMocks();
  });

  it("maps CMS file identifiers into resume, brand, about and hispano images", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [],
        career: [],
        social: [],
        files: [
          {
            identifier: "resume",
            title: "Resume",
            description: "Public Resume",
            file: "https://cms.alexanderschilling.cl/api/files/portfolio_files/gw771mejnky51wi/cv_en_public_schilling_alexander_gebb59bwqe.pdf",
          },
          {
            identifier: "brand_logo",
            title: "Brand Logo",
            description: "Main logo",
            file: "https://cms.alexanderschilling.cl/api/files/portfolio_files/logo/logo.png",
          },
          {
            identifier: "profile_picture",
            title: "Profile Picture",
            description: "About portrait",
            file: "https://cms.alexanderschilling.cl/api/files/portfolio_files/profile/profile.jpg",
          },
          {
            identifier: "hispano_banner",
            title: "Hispano Banner",
            description: "Community banner",
            file: "https://cms.alexanderschilling.cl/api/files/portfolio_files/hispano/banner.jpg",
          },
        ],
      }),
    } as Response);

    const result = await getPortfolioData("en");

    expect(result.siteContent.resumeUrl).toBe(
      "https://cms.alexanderschilling.cl/api/files/portfolio_files/gw771mejnky51wi/cv_en_public_schilling_alexander_gebb59bwqe.pdf",
    );
    expect(result.siteContent.brandLogoUrl).toBe("https://cms.alexanderschilling.cl/api/files/portfolio_files/logo/logo.png");
    expect(result.siteContent.about.portraitUrl).toBe("https://cms.alexanderschilling.cl/api/files/portfolio_files/profile/profile.jpg");
    expect(result.siteContent.gaming.imageUrl).toBe("https://cms.alexanderschilling.cl/api/files/portfolio_files/hispano/banner.jpg");
  });

  it("falls back to local resumeUrl when resume file is missing", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [],
        career: [],
        social: [],
        files: [],
      }),
    } as Response);

    const result = await getPortfolioData("en");

    expect(result.siteContent.resumeUrl).toBe(fallbackSiteContent.resumeUrl);
    expect(result.siteContent.brandLogoUrl).toBe(fallbackSiteContent.brandLogoUrl);
    expect(result.siteContent.about.portraitUrl).toBe(fallbackSiteContent.about.portraitUrl);
    expect(result.siteContent.gaming.imageUrl).toBe(fallbackSiteContent.gaming.imageUrl);
  });

  it("accepts legacy payloads without files", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [],
        career: [],
        social: [],
      }),
    } as Response);

    const result = await getPortfolioData("en");

    expect(result.siteContent.resumeUrl).toBe(fallbackSiteContent.resumeUrl);
  });
});

