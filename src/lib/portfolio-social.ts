import type { GamingLink } from "@/types/portfolio";
import type { PortfolioSocialItem } from "@/types/portfolio-api";

export const FOOTER_SOCIAL_IDENTIFIERS = ["linkedin", "photo_instagram", "github"] as const;
export const GAMING_SOCIAL_IDENTIFIERS = ["hispano_discord", "hispano_web", "hispano_instagram"] as const;

function buildIdentifierMap(socialItems: PortfolioSocialItem[]) {
  return new Map(socialItems.map((item) => [item.identifier, item]));
}

export function buildOrderedSocialLinks(
  socialItems: PortfolioSocialItem[],
  identifiers: readonly string[],
  fallbackLinks: GamingLink[],
) {
  const socialMap = buildIdentifierMap(socialItems);
  const missingIdentifiers: string[] = [];

  const links = identifiers.map((identifier, index) => {
    const socialItem = socialMap.get(identifier);

    if (!socialItem) {
      missingIdentifiers.push(identifier);
      return fallbackLinks[index];
    }

    return {
      label: socialItem.label,
      href: socialItem.url,
      identifier,
    };
  });

  return {
    links,
    missingIdentifiers,
  };
}

