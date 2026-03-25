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

  it("maps CMS file identifiers into hero, resume, brand, about and hispano images", async () => {
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
          {
            identifier: "hero_background",
            title: "Hero Background",
            description: "Hero background image",
            file: "https://cms.alexanderschilling.cl/api/files/portfolio_files/hero/hero-bg.jpg",
          },
        ],
      }),
    } as Response);

    const result = await getPortfolioData("en");

    expect(result.siteContent.hero.backgroundImageUrl).toBe("https://cms.alexanderschilling.cl/api/files/portfolio_files/hero/hero-bg.jpg");
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

    expect(result.siteContent.hero.backgroundImageUrl).toBe(fallbackSiteContent.hero.backgroundImageUrl);
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

    expect(result.siteContent.hero.backgroundImageUrl).toBe(fallbackSiteContent.hero.backgroundImageUrl);
    expect(result.siteContent.resumeUrl).toBe(fallbackSiteContent.resumeUrl);
  });

  it("maps icon metadata from CMS content into about, career and section headings", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [
          {
            type: "about_badge_1",
            content: '<div data-icon="curiosity"><h4>Curiosity</h4><p>Lifelong learner since 1996.</p></div>',
          },
          {
            type: "about_badge_2",
            content: '<div data-icon="leadership"><h4>Leadership</h4><p>Guiding teams, growing talent.</p></div>',
          },
          {
            type: "photo_title",
            content: "[[icon:camera]] Photography",
          },
          {
            type: "hispano_title",
            content: '<span data-icon="joystick">Comunidad Hispano</span>',
          },
        ],
        career: [
          {
            from_until: "2021 - PRESENT",
            position: "Principal Data Engineer & Tech Lead",
            company: "Visa/Mastercard Ecosystem",
            description: [
              '<p data-icon="insights">Reduced processing latency by 65%.</p>',
              '<p>[icon:groups] Mentored a cross-functional team of 12 engineers.</p>',
              '<div><icon>architecture</icon>Architected a real-time fraud detection engine.</div>',
            ].join(""),
            prio_order: 1,
          },
        ],
        social: [],
      }),
    } as Response);

    const result = await getPortfolioData("en");

    expect(result.siteContent.about.features[0].iconKey).toBe("curiosity");
    expect(result.siteContent.about.features[1].iconKey).toBe("leadership");
    expect(result.siteContent.passions.heading).toBe("Photography");
    expect(result.siteContent.passions.iconKey).toBe("camera");
    expect(result.siteContent.gaming.heading).toBe("Comunidad Hispano");
    expect(result.siteContent.gaming.iconKey).toBe("joystick");
    expect(result.siteContent.experience[0].highlights).toEqual([
      { text: "Reduced processing latency by 65%.", iconKey: "insights" },
      { text: "Mentored a cross-functional team of 12 engineers.", iconKey: "groups" },
      { text: "Architected a real-time fraud detection engine.", iconKey: "architecture" },
    ]);
  });

  it("maps company website and linkedin URLs for experience entries", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [],
        career: [
          {
            from_until: "2021 - PRESENT",
            position: "Principal Data Engineer & Tech Lead",
            company: "Visa/Mastercard Ecosystem",
            company_url: "https://example.com/company",
            company_linkedin: "https://www.linkedin.com/company/example-company/",
            modality: "Hybrid",
            description: "<p>Led platform initiatives.</p>",
            prio_order: 1,
          },
        ],
        social: [],
      }),
    } as Response);

    const result = await getPortfolioData("en");

    expect(result.siteContent.experience[0].companyUrl).toBe("https://example.com/company");
    expect(result.siteContent.experience[0].companyLinkedin).toBe("https://www.linkedin.com/company/example-company/");
    expect(result.siteContent.experience[0].modality).toBe("Hybrid");
  });
});

