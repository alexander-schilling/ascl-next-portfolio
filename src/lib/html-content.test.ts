import { describe, expect, it } from "vitest";

import { decodeHtmlEntities, stripHtml } from "@/lib/html-content";

describe("html-content", () => {
  it("decodes spanish named entities correctly", () => {
    expect(decodeHtmlEntities("El humano detr&aacute;s del c&oacute;digo")).toBe("El humano detrás del código");
  });

  it("strips html while preserving decoded spanish characters", () => {
    expect(stripHtml("<p>El humano detr&aacute;s del c&oacute;digo</p>")).toBe("El humano detrás del código");
  });

  it("decodes numeric entities as well", () => {
    expect(decodeHtmlEntities("Tecnolog&#237;a y programaci&#243;n")).toBe("Tecnología y programación");
  });
});

