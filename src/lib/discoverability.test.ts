import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import robots, { dynamic as robotsDynamic } from "@/app/robots";
import sitemap, { dynamic as sitemapDynamic } from "@/app/sitemap";
import { getFallbackSiteContent } from "@/data/portfolio";
import { ContactSection } from "@/components/sections/contact-section";
import { getProfileSchema, serializeProfileSchema } from "@/lib/profile-schema";
import { buildPublicEmailMarkup, getPublicEmail } from "@/lib/public-email";

afterEach(() => vi.unstubAllEnvs());

describe("public discoverability", () => {
  it("resolves robots and canonical sitemap from container configuration rather than the build origin", () => {
    expect(robotsDynamic).toBe("force-dynamic");
    expect(sitemapDynamic).toBe("force-dynamic");
    vi.stubEnv("SITE_URL", "https://preview.example.org");
    robots();
    sitemap();
    vi.stubEnv("SITE_URL", "https://alexanderschilling.cl");
    expect(robots().sitemap).toBe("https://alexanderschilling.cl/sitemap.xml");
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://alexanderschilling.cl/en", "https://alexanderschilling.cl/es",
    ]);
    for (const entry of sitemap()) {
      expect(entry.alternates?.languages?.es).toBe("https://alexanderschilling.cl/es");
      expect(entry.lastModified).toBeUndefined();
    }
  });

  it.each(["es", "en"] as const)("exposes %s identity and contact from the same visible CMS content", (lang) => {
    vi.stubEnv("SITE_URL", "https://alexanderschilling.cl");
    const content = structuredClone(getFallbackSiteContent(lang));
    const schema = getProfileSchema(lang, content);
    expect(schema.mainEntity.name).toBe("Alexander Schilling");
    expect(schema.mainEntity.email).toBe("contacto@alexanderschilling.cl");
    expect(schema.mainEntity.jobTitle).toBe(content.experience[0].role);
    expect(schema.mainEntity.worksFor?.name).toBe(content.experience[0].company);
    expect(schema.mainEntity.sameAs).toContain("https://github.com/alexander-schilling");
    expect(schema.url).toBe(`https://alexanderschilling.cl/${lang}`);
    expect(schema.subjectOf?.url).toBe(content.resumeUrl);
    content.experience[0].role = "Updated CMS role";
    expect(getProfileSchema(lang, content).mainEntity.jobTitle).toBe("Updated CMS role");
  });

  it("prevents CMS copy from terminating the JSON-LD script", () => {
    const content = structuredClone(getFallbackSiteContent("en"));
    content.seo.description = '</script><script>alert("test")</script>';
    const schema = getProfileSchema("en", content);
    const serialized = serializeProfileSchema(schema);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual(schema);
  });

  it("renders a public email link inside Cloudflare exclusion comments before hydration", () => {
    const html = renderToStaticMarkup(createElement(ContactSection, { content: getFallbackSiteContent("es").contact }));
    expect(html).toMatch(/<!--email_off--><a href="mailto:contacto@alexanderschilling\.cl"[^>]*>contacto@alexanderschilling\.cl<\/a><!--\/email_off-->/);
  });

  it("rejects malformed addresses and escapes attributes in the exclusion markup", () => {
    expect(getPublicEmail("mailto:contacto%0A@alexanderschilling.cl")).toBeUndefined();
    expect(getPublicEmail("javascript:alert(1)")).toBeUndefined();
    expect(getPublicEmail("mailto:%broken")).toBeUndefined();
    expect(() => buildPublicEmailMarkup('a\"><script>@example.com', "text-sm")).toThrow();
    expect(buildPublicEmailMarkup("contacto@example.com", 'x" onclick="alert(1)')).not.toContain('class="x" onclick=');
  });
});
