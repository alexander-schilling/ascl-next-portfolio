import { describe, expect, it } from "vitest";

import { analyzeContentTypes } from "@/lib/portfolio-content-types";
import { EXPECTED_CONTENT_TYPES } from "@/types/portfolio-api";

describe("analyzeContentTypes", () => {
  it("returns all expected content types as missing when content is empty", () => {
    const result = analyzeContentTypes([]);

    expect(result.missingContentTypes).toEqual(EXPECTED_CONTENT_TYPES);
    expect(result.duplicateContentTypes).toEqual([]);
    expect(result.unknownContentTypes).toEqual([]);
  });

  it("returns no diagnostics when the payload contains the exact catalog once", () => {
    const result = analyzeContentTypes(
      EXPECTED_CONTENT_TYPES.map((type) => ({
        type,
        content: `<p>${type}</p>`,
      })),
    );

    expect(result.missingContentTypes).toEqual([]);
    expect(result.duplicateContentTypes).toEqual([]);
    expect(result.unknownContentTypes).toEqual([]);
  });

  it("detects duplicate and unknown content types with deterministic ordering", () => {
    const result = analyzeContentTypes([
      { type: "banner_badge", content: "one" },
      { type: "banner_badge", content: "two" },
      { type: "custom_block", content: "three" },
      { type: "zeta_block", content: "four" },
      { type: "custom_block", content: "five" },
    ]);

    expect(result.duplicateContentTypes).toEqual(["banner_badge", "custom_block"]);
    expect(result.unknownContentTypes).toEqual(["custom_block", "zeta_block"]);
    expect(result.missingContentTypes).not.toContain("banner_badge");
    expect(result.missingContentTypes).toContain("banner_title");
  });
});

