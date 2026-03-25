import { EXPECTED_CONTENT_TYPES, type PortfolioContentItem, type PortfolioDiagnostics } from "@/types/portfolio-api";

export function analyzeContentTypes(content: PortfolioContentItem[]) {
  const expectedTypes = new Set<string>(EXPECTED_CONTENT_TYPES);
  const seenCounts = new Map<string, number>();

  for (const item of content) {
    const currentCount = seenCounts.get(item.type) ?? 0;
    seenCounts.set(item.type, currentCount + 1);
  }

  const duplicateContentTypes = Array.from(seenCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([type]) => type)
    .sort((a, b) => a.localeCompare(b));

  const unknownContentTypes = Array.from(seenCounts.keys())
    .filter((type) => !expectedTypes.has(type))
    .sort((a, b) => a.localeCompare(b));

  const missingContentTypes = EXPECTED_CONTENT_TYPES.filter((type) => !seenCounts.has(type));

  return {
    missingContentTypes,
    duplicateContentTypes,
    unknownContentTypes,
  } satisfies Pick<PortfolioDiagnostics, "missingContentTypes" | "duplicateContentTypes" | "unknownContentTypes">;
}

