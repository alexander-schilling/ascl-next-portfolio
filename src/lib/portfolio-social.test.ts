import { describe, expect, it } from "vitest";

import {
  buildOrderedSocialLinks,
  FOOTER_SOCIAL_IDENTIFIERS,
  GAMING_SOCIAL_IDENTIFIERS,
} from "@/lib/portfolio-social";

describe("buildOrderedSocialLinks", () => {
  it("maps hispano social identifiers to gaming links in stable order", () => {
    const result = buildOrderedSocialLinks(
      [
        { identifier: "hispano_instagram", label: "Instagram", url: "https://instagram.com/hispano" },
        { identifier: "hispano_discord", label: "Discord", url: "https://discord.gg/hispano" },
        { identifier: "hispano_web", label: "Website", url: "https://hispano.example.com" },
      ],
      GAMING_SOCIAL_IDENTIFIERS,
      [
        { label: "Discord", href: "#discord" },
        { label: "Website", href: "#website" },
        { label: "Instagram", href: "#instagram" },
      ],
    );

    expect(result.links).toEqual([
      { label: "Discord", href: "https://discord.gg/hispano" },
      { label: "Website", href: "https://hispano.example.com" },
      { label: "Instagram", href: "https://instagram.com/hispano" },
    ]);
    expect(result.missingIdentifiers).toEqual([]);
  });

  it("uses fallback only for missing identifiers", () => {
    const result = buildOrderedSocialLinks(
      [{ identifier: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/example" }],
      FOOTER_SOCIAL_IDENTIFIERS,
      [
        { label: "LinkedIn", href: "#linkedin" },
        { label: "Instagram", href: "#instagram" },
        { label: "GitHub", href: "#github" },
      ],
    );

    expect(result.links).toEqual([
      { label: "LinkedIn", href: "https://linkedin.com/in/example" },
      { label: "Instagram", href: "#instagram" },
      { label: "GitHub", href: "#github" },
    ]);
    expect(result.missingIdentifiers).toEqual(["photo_instagram", "github"]);
  });

  it("does not leak hispano socials into footer identifiers", () => {
    const result = buildOrderedSocialLinks(
      [
        { identifier: "hispano_discord", label: "Discord", url: "https://discord.gg/hispano" },
        { identifier: "hispano_web", label: "Website", url: "https://hispano.example.com" },
        { identifier: "hispano_instagram", label: "Instagram", url: "https://instagram.com/hispano" },
      ],
      FOOTER_SOCIAL_IDENTIFIERS,
      [
        { label: "LinkedIn", href: "#linkedin" },
        { label: "Instagram", href: "#instagram" },
        { label: "GitHub", href: "#github" },
      ],
    );

    expect(result.links).toEqual([
      { label: "LinkedIn", href: "#linkedin" },
      { label: "Instagram", href: "#instagram" },
      { label: "GitHub", href: "#github" },
    ]);
    expect(result.missingIdentifiers).toEqual(["linkedin", "photo_instagram", "github"]);
  });
});

