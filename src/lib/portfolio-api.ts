import { siteContent as fallbackSiteContent } from "@/data/portfolio";
import { decodeHtmlEntities, stripHtml } from "@/lib/html-content";
import { EXPECTED_CONTENT_TYPES } from "@/types/portfolio-api";
import { analyzeContentTypes } from "@/lib/portfolio-content-types";
import type { SiteContent } from "@/types/portfolio";
import type {
  ExpectedContentType,
  PortfolioApiResponse,
  PortfolioCareerItem,
  PortfolioContentItem,
  PortfolioDiagnostics,
  PortfolioLanguage,
  PortfolioSocialItem,
} from "@/types/portfolio-api";

const HTML_BREAK_REGEX = /<br\s*\/?\s*>/gi;

function extractTagText(value: string, tagName: string) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = value.match(regex);
  return match ? stripHtml(match[1]) : "";
}

function extractTagList(value: string, tagName: string) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  return Array.from(value.matchAll(regex))
    .map((item) => stripHtml(item[1]))
    .filter(Boolean);
}

function splitByBreaks(value: string) {
  return decodeHtmlEntities(value)
    .replace(HTML_BREAK_REGEX, "\n")
    .split("\n")
    .map((line) => stripHtml(line))
    .filter(Boolean);
}

function isPortfolioApiResponse(value: unknown): value is PortfolioApiResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PortfolioApiResponse>;
  return Array.isArray(candidate.content) && Array.isArray(candidate.career) && Array.isArray(candidate.social);
}

function getContentMap(content: PortfolioContentItem[]) {
  const map = new Map<string, string>();
  for (const item of content) {
    map.set(item.type, item.content);
  }
  return map;
}

function getSocialMap(social: PortfolioSocialItem[]) {
  const map = new Map<string, PortfolioSocialItem>();
  for (const item of social) {
    map.set(item.identifier, item);
  }
  return map;
}

function parseLang(rawLang?: string): PortfolioLanguage {
  return rawLang === "es" ? "es" : "en";
}

function localizeSiteChrome(content: SiteContent, lang: PortfolioLanguage) {
  if (lang === "es") {
    return {
      ...content,
      navLinks: [
        { label: "Historia", href: "#about" },
        { label: "Carrera", href: "#experience" },
        { label: "Pasiones", href: "#passions" },
        { label: "Contacto", href: "#contact" },
      ],
    };
  }

  return {
    ...content,
    navLinks: [
      { label: "Story", href: "#about" },
      { label: "Career", href: "#experience" },
      { label: "Passions", href: "#passions" },
      { label: "Contact", href: "#contact" },
    ],
  };
}

function parseCareerHighlights(item: PortfolioCareerItem) {
  const paragraphs = extractTagList(item.description, "p");
  const divLines = extractTagList(item.description, "div");
  const lines = [...paragraphs, ...divLines]
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line, index, all) => all.indexOf(line) === index);

  if (lines.length > 0) {
    return lines;
  }

  const plainDescription = stripHtml(item.description);
  return plainDescription ? [plainDescription] : [];
}

function reportDiagnostics(lang: PortfolioLanguage, diagnostics: PortfolioDiagnostics) {
  if (
    diagnostics.missingContentTypes.length === 0
    && diagnostics.duplicateContentTypes.length === 0
    && diagnostics.unknownContentTypes.length === 0
    && diagnostics.warnings.length === 0
  ) {
    return;
  }

  console.warn("[portfolio-content]", {
    lang,
    missingContentTypes: diagnostics.missingContentTypes,
    duplicateContentTypes: diagnostics.duplicateContentTypes,
    unknownContentTypes: diagnostics.unknownContentTypes,
    warnings: diagnostics.warnings,
  });
}

function mapToSiteContent(payload: PortfolioApiResponse): { siteContent: SiteContent; diagnostics: PortfolioDiagnostics } {
  const contentMap = getContentMap(payload.content);
  const socialMap = getSocialMap(payload.social);
  const contentTypeDiagnostics = analyzeContentTypes(payload.content);
  const warnings: string[] = [];

  const getValue = (type: string) => contentMap.get(type) ?? "";
  const pickText = (type: string, fallback: string) => {
    const raw = getValue(type);
    const text = stripHtml(raw);
    return text || fallback;
  };

  const bannerTitleLines = extractTagList(getValue("banner_title"), "p");
  const aboutStatusLines = extractTagList(getValue("about_status"), "p");
  const aboutParagraphs = extractTagList(getValue("about_content"), "p");
  const aboutHeading = extractTagText(getValue("about_content"), "h1");
  const aboutBadge1Title = extractTagText(getValue("about_badge_1"), "h4");
  const aboutBadge1Description = extractTagText(getValue("about_badge_1"), "p");
  const aboutBadge2Title = extractTagText(getValue("about_badge_2"), "h4");
  const aboutBadge2Description = extractTagText(getValue("about_badge_2"), "p");
  const careerTitleLines = splitByBreaks(getValue("career_title"));
  const contactTitleLines = splitByBreaks(getValue("contact_title"));

  const instagram = socialMap.get("photo_instagram");
  const linkedin = socialMap.get("linkedin");
  const github = socialMap.get("github");

  if (!instagram) {
    warnings.push("Falta social identifier 'photo_instagram' para el CTA de fotografia.");
  }

  if (!linkedin || !github) {
    warnings.push("Faltan social identifiers 'linkedin' y/o 'github' para CTAs de contacto.");
  }

  const sortedCareer = payload.career
    .filter((item) => item.enabled !== false)
    .sort((a, b) => a.prio_order - b.prio_order);

  const mappedExperience = sortedCareer.map((item) => ({
    period: item.from_until,
    role: item.position,
    company: item.company,
    highlights: parseCareerHighlights(item),
    imageUrl: item.company_image,
  }));

  const siteContent: SiteContent = {
    ...fallbackSiteContent,
    hero: {
      ...fallbackSiteContent.hero,
      badge: pickText("banner_badge", fallbackSiteContent.hero.badge),
      title: bannerTitleLines[0] ?? fallbackSiteContent.hero.title,
      highlightedTitle: bannerTitleLines[1] ?? fallbackSiteContent.hero.highlightedTitle,
      subtitle: pickText("banner_subtitle", fallbackSiteContent.hero.subtitle),
      primaryCta: {
        ...fallbackSiteContent.hero.primaryCta,
        label: pickText("banner_story_button", fallbackSiteContent.hero.primaryCta.label),
      },
      secondaryCta: {
        ...fallbackSiteContent.hero.secondaryCta,
        label: pickText("banner_work_button", fallbackSiteContent.hero.secondaryCta.label),
      },
    },
    about: {
      ...fallbackSiteContent.about,
      heading: aboutHeading || fallbackSiteContent.about.heading,
      paragraphs: aboutParagraphs.length > 0 ? aboutParagraphs : fallbackSiteContent.about.paragraphs,
      statusTitle: aboutStatusLines[0] ?? fallbackSiteContent.about.statusTitle,
      statusLabel: aboutStatusLines[1] ?? fallbackSiteContent.about.statusLabel,
      features: [
        {
          title: aboutBadge1Title || fallbackSiteContent.about.features[0].title,
          description: aboutBadge1Description || fallbackSiteContent.about.features[0].description,
        },
        {
          title: aboutBadge2Title || fallbackSiteContent.about.features[1].title,
          description: aboutBadge2Description || fallbackSiteContent.about.features[1].description,
        },
      ],
    },
    experienceSection: {
      eyebrow: pickText("career_subtitle", fallbackSiteContent.experienceSection.eyebrow),
      title: careerTitleLines[0] ?? fallbackSiteContent.experienceSection.title,
      highlightedTitle: careerTitleLines[1] ?? fallbackSiteContent.experienceSection.highlightedTitle,
      description: pickText("career_description", fallbackSiteContent.experienceSection.description),
    },
    experience: mappedExperience.length > 0 ? mappedExperience : fallbackSiteContent.experience,
    passions: {
      ...fallbackSiteContent.passions,
      heading: pickText("photo_title", fallbackSiteContent.passions.heading),
      description: pickText("photo_description", fallbackSiteContent.passions.description),
      instagramHandle: pickText("photo_instagram", fallbackSiteContent.passions.instagramHandle),
      instagramUrl: instagram?.url ?? fallbackSiteContent.passions.instagramUrl,
    },
    gaming: {
      ...fallbackSiteContent.gaming,
      heading: pickText("hispano_title", fallbackSiteContent.gaming.heading),
      description: pickText("hispano_description", fallbackSiteContent.gaming.description),
      stats: [
        {
          label: extractTagText(getValue("hispano_badge_1"), "h4") || fallbackSiteContent.gaming.stats[0].label,
          value: extractTagText(getValue("hispano_badge_1"), "p") || fallbackSiteContent.gaming.stats[0].value,
        },
        {
          label: extractTagText(getValue("hispano_badge_2"), "h4") || fallbackSiteContent.gaming.stats[1].label,
          value: extractTagText(getValue("hispano_badge_2"), "p") || fallbackSiteContent.gaming.stats[1].value,
        },
      ],
    },
    contact: {
      ...fallbackSiteContent.contact,
      heading: contactTitleLines[0] ?? fallbackSiteContent.contact.heading,
      highlighted: contactTitleLines[1] ?? fallbackSiteContent.contact.highlighted,
      description: pickText("contact_description", fallbackSiteContent.contact.description),
      ctas: [
        {
          label: linkedin?.label ?? fallbackSiteContent.contact.ctas[0].label,
          href: linkedin?.url ?? fallbackSiteContent.contact.ctas[0].href,
        },
        {
          label: github?.label ?? fallbackSiteContent.contact.ctas[1].label,
          href: github?.url ?? fallbackSiteContent.contact.ctas[1].href,
        },
      ],
    },
    footerLinks: payload.social.length > 0
      ? payload.social.map((item) => ({ label: item.label, href: item.url }))
      : fallbackSiteContent.footerLinks,
  };

  if (mappedExperience.length === 0) {
    warnings.push("La coleccion 'portfolio_career' no devolvio registros habilitados; se usa fallback local.");
  }

  return {
    siteContent,
    diagnostics: {
      ...contentTypeDiagnostics,
      warnings,
    },
  };
}

export async function getPortfolioData(rawLang?: string) {
  const lang = parseLang(rawLang);
  const baseUrl = process.env.PORTFOLIO_API_BASE_URL;

  if (!baseUrl) {
    const diagnostics = {
      missingContentTypes: [...EXPECTED_CONTENT_TYPES],
      duplicateContentTypes: [],
      unknownContentTypes: [],
      warnings: ["Define PORTFOLIO_API_BASE_URL para consumir el backend de portfolio."],
    } satisfies PortfolioDiagnostics;

    reportDiagnostics(lang, diagnostics);

    return {
      lang,
      siteContent: localizeSiteChrome(fallbackSiteContent, lang),
      diagnostics,
    };
  }

  try {
    const url = new URL("/portfolio", baseUrl);
    url.searchParams.set("lang", lang);

    const response = await fetch(url, { next: { revalidate: 60 } });

    if (!response.ok) {
      const diagnostics = {
        missingContentTypes: [...EXPECTED_CONTENT_TYPES],
        duplicateContentTypes: [],
        unknownContentTypes: [],
        warnings: [`El backend respondio ${response.status} al consultar ${url.pathname}.`],
      } satisfies PortfolioDiagnostics;

      reportDiagnostics(lang, diagnostics);

      return {
        lang,
        siteContent: localizeSiteChrome(fallbackSiteContent, lang),
        diagnostics,
      };
    }

    const payload: unknown = await response.json();

    if (!isPortfolioApiResponse(payload)) {
      const diagnostics = {
        missingContentTypes: [...EXPECTED_CONTENT_TYPES],
        duplicateContentTypes: [],
        unknownContentTypes: [],
        warnings: ["Respuesta invalida del backend: se esperaba { content, career, social }."],
      } satisfies PortfolioDiagnostics;

      reportDiagnostics(lang, diagnostics);

      return {
        lang,
        siteContent: localizeSiteChrome(fallbackSiteContent, lang),
        diagnostics,
      };
    }

    const mapped = mapToSiteContent(payload);
    reportDiagnostics(lang, mapped.diagnostics);
    return {
      lang,
      ...mapped,
      siteContent: localizeSiteChrome(mapped.siteContent, lang),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    const diagnostics = {
      missingContentTypes: [...EXPECTED_CONTENT_TYPES],
      duplicateContentTypes: [],
      unknownContentTypes: [],
      warnings: [`No fue posible conectar al backend: ${message}`],
    } satisfies PortfolioDiagnostics;

    reportDiagnostics(lang, diagnostics);

    return {
      lang,
      siteContent: localizeSiteChrome(fallbackSiteContent, lang),
      diagnostics,
    };
  }
}

export type RequiredContentType = ExpectedContentType;







