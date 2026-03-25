import { unstable_cache } from "next/cache";
import { siteContent as fallbackSiteContent } from "@/data/portfolio";
import {
  inferAboutFeatureIconKey,
  inferCareerHighlightIconKey,
  normalizeContentIconKey,
} from "@/lib/content-icons";
import { decodeHtmlEntities, stripHtml } from "@/lib/html-content";
import { EXPECTED_CONTENT_TYPES } from "@/types/portfolio-api";
import { analyzeContentTypes } from "@/lib/portfolio-content-types";
import {
  buildOrderedSocialLinks,
  FOOTER_SOCIAL_IDENTIFIERS,
  GAMING_SOCIAL_IDENTIFIERS,
} from "@/lib/portfolio-social";
import type { SiteContent } from "@/types/portfolio";
import type {
  PortfolioApiResponse,
  PortfolioCareerItem,
  PortfolioContentItem,
  PortfolioDiagnostics,
  PortfolioFileItem,
  PortfolioLanguage,
  PortfolioSocialItem,
} from "@/types/portfolio-api";

const HTML_BREAK_REGEX = /<br\s*\/?\s*>/gi;
const CONTENT_BLOCK_REGEX = /<(p|div)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
const CONTENT_ICON_ATTRIBUTE_REGEX = /\b(?:data-icon|data-icon-key|icon|identifier)=["']([^"']+)["']/i;
const CONTENT_ICON_TAG_REGEX = /<icon[^>]*>([\s\S]*?)<\/icon>/i;
const CONTENT_ICON_TOKEN_REGEX = /^\s*\[{1,2}icon:([a-z0-9_\- ]+)\]{1,2}\s*/i;
const PORTFOLIO_CACHE_TAG = "portfolio-data";
const DEFAULT_PORTFOLIO_CACHE_REVALIDATE_SECONDS = 300;

type ParsedContentBlock = {
  text: string;
  iconKey?: ReturnType<typeof normalizeContentIconKey>;
};

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

type PortfolioDataResult = {
  lang: PortfolioLanguage;
  siteContent: SiteContent;
  diagnostics: PortfolioDiagnostics;
};

class PortfolioLoadError extends Error {
  constructor(public readonly warnings: string[]) {
    super(warnings[0] ?? "Portfolio load error");
    this.name = "PortfolioLoadError";
  }
}

function getPortfolioCacheTag(lang: PortfolioLanguage) {
  return `${PORTFOLIO_CACHE_TAG}:${lang}`;
}

function getPortfolioCacheRevalidateSeconds() {
  const rawValue = process.env.PORTFOLIO_CACHE_REVALIDATE_SECONDS;
  const parsedValue = Number.parseInt(rawValue ?? "", 10);

  if (Number.isFinite(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return DEFAULT_PORTFOLIO_CACHE_REVALIDATE_SECONDS;
}

function createFallbackDiagnostics(warnings: string[]): PortfolioDiagnostics {
  return {
    missingContentTypes: [...EXPECTED_CONTENT_TYPES],
    duplicateContentTypes: [],
    unknownContentTypes: [],
    warnings,
  };
}

function createFallbackResult(lang: PortfolioLanguage, warnings: string[]): PortfolioDataResult {
  return {
    lang,
    siteContent: localizeSiteChrome(fallbackSiteContent, lang),
    diagnostics: createFallbackDiagnostics(warnings),
  };
}

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

function stripLeadingIconToken(value: string) {
  return value.replace(CONTENT_ICON_TOKEN_REGEX, "").trim();
}

function extractInlineIconIdentifier(value: string) {
  const attributeMatch = value.match(CONTENT_ICON_ATTRIBUTE_REGEX);

  if (attributeMatch?.[1]) {
    return attributeMatch[1];
  }

  const iconTagMatch = value.match(CONTENT_ICON_TAG_REGEX);

  if (iconTagMatch?.[1]) {
    return stripHtml(iconTagMatch[1]);
  }

  const tokenMatch = stripHtml(value).match(CONTENT_ICON_TOKEN_REGEX);
  return tokenMatch?.[1];
}

function parseContentBlock(rawHtml: string) {
  const iconKey = normalizeContentIconKey(extractInlineIconIdentifier(rawHtml));
  const text = stripLeadingIconToken(stripHtml(rawHtml.replace(CONTENT_ICON_TAG_REGEX, " ")));

  if (!text) {
    return undefined;
  }

  return {
    text,
    iconKey,
  } satisfies ParsedContentBlock;
}

function parseRichTextBlocks(value: string) {
  const matches = Array.from(value.matchAll(CONTENT_BLOCK_REGEX));

  if (matches.length === 0) {
    return splitByBreaks(value)
      .map((line) => {
        const normalizedLine = stripLeadingIconToken(line);

        if (!normalizedLine) {
          return undefined;
        }

        return {
          text: normalizedLine,
          iconKey: normalizeContentIconKey(line.match(CONTENT_ICON_TOKEN_REGEX)?.[1]),
        } satisfies ParsedContentBlock;
      })
      .filter(isDefined);
  }

  return matches
    .map((match) => parseContentBlock(match[0]))
    .filter(isDefined)
    .filter((block, index, all) => all.findIndex((candidate) => candidate.text === block.text) === index);
}

function isPortfolioFileItem(value: unknown): value is PortfolioFileItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PortfolioFileItem>;

  return (
    typeof candidate.identifier === "string"
    && typeof candidate.title === "string"
    && typeof candidate.description === "string"
    && typeof candidate.file === "string"
  );
}

function isPortfolioApiResponse(value: unknown): value is PortfolioApiResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PortfolioApiResponse>;
  const hasRequiredCollections = (
    Array.isArray(candidate.content)
    && Array.isArray(candidate.career)
    && Array.isArray(candidate.social)
  );

  if (!hasRequiredCollections) {
    return false;
  }

  if (candidate.files === undefined) {
    return true;
  }

  return Array.isArray(candidate.files) && candidate.files.every((item) => isPortfolioFileItem(item));
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

function getFileMap(files: PortfolioFileItem[] = []) {
  const map = new Map<string, PortfolioFileItem>();
  for (const item of files) {
    map.set(item.identifier, item);
  }
  return map;
}

function mapPassionsGallery(
  files: PortfolioFileItem[] = [],
  fallbackGallery: SiteContent["passions"]["gallery"],
): SiteContent["passions"]["gallery"] {
  const backendGallery = files
    .map((item) => {
      const match = item.identifier.match(/^(?:photo|passions)_gallery_(\d+)$/i);

      if (!match || !item.file) {
        return undefined;
      }

      return {
        order: Number.parseInt(match[1], 10),
        title: stripHtml(item.title).trim(),
        imageUrl: item.file,
      };
    })
    .filter(isDefined)
    .sort((a, b) => a.order - b.order);

  if (backendGallery.length === 0) {
    return fallbackGallery;
  }

  return backendGallery.map((item, index) => ({
    title: item.title || fallbackGallery[index]?.title || `Photo ${index + 1}`,
    imageUrl: item.imageUrl,
    featured: index === 0,
  }));
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
      resumeLabel: "CV",
      languageSwitcher: {
        enLabel: "Ingles",
        esLabel: "Español",
      },
      experienceShowMoreLabel: "Ver hitos anteriores",
      seo: {
        title: "Alexander | Portafolio de Data Engineering",
        description: "Portafolio de Alexander: Data Engineering Tech Lead, arquitectura de sistemas distribuidos y proyectos personales.",
        openGraphDescription: "Sistemas a escala, liderazgo técnico y creatividad fuera de la terminal.",
        siteName: "Portafolio de Alexander",
      },
      manifest: {
        name: "Alexander | Portafolio de Data Engineering",
        shortName: "Alexander",
        description: "Portafolio personal de un Data Engineering Tech Lead enfocado en sistemas distribuidos, liderazgo y trabajo creativo.",
      },
      footerNote: "Alexander • Construido con pasion y precision.",
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
    resumeLabel: "Resume",
    languageSwitcher: {
      enLabel: "English",
      esLabel: "Spanish",
    },
    experienceShowMoreLabel: "View Prior Milestones",
    seo: {
      title: "Alexander | Data Engineering Portfolio",
      description: "Alexander's portfolio: Data Engineering Tech Lead, distributed systems architecture, and personal projects.",
      openGraphDescription: "Systems at scale, technical leadership, and creativity beyond the terminal.",
      siteName: "Alexander Portfolio",
    },
    manifest: {
      name: "Alexander | Data Engineering Portfolio",
      shortName: "Alexander",
      description: "Personal portfolio for a Data Engineering Tech Lead focused on distributed systems, leadership, and creative work.",
    },
    footerNote: "Alexander • Built with Passion and Precision.",
  };
}

function parseCareerHighlights(item: PortfolioCareerItem) {
  const lines = parseRichTextBlocks(item.description).map((block) => ({
    text: block.text,
    iconKey: block.iconKey ?? inferCareerHighlightIconKey(block.text),
  }));

  if (lines.length > 0) {
    return lines;
  }

  const plainDescription = stripHtml(item.description);
  return plainDescription
    ? [{ text: plainDescription, iconKey: inferCareerHighlightIconKey(plainDescription) }]
    : [];
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

async function loadRemotePortfolioData(baseUrl: string, lang: PortfolioLanguage, revalidateSeconds: number): Promise<PortfolioDataResult> {
  const url = new URL("/portfolio", baseUrl);
  url.searchParams.set("lang", lang);

  const response = await fetch(url, {
    cache: "force-cache",
    next: {
      revalidate: revalidateSeconds,
      tags: [PORTFOLIO_CACHE_TAG, getPortfolioCacheTag(lang)],
    },
  });

  if (!response.ok) {
    throw new PortfolioLoadError([
      `El backend respondio ${response.status} al consultar ${url.pathname}.`,
    ]);
  }

  const payload: unknown = await response.json();

  if (!isPortfolioApiResponse(payload)) {
    throw new PortfolioLoadError([
      "Respuesta invalida del backend: se esperaba { content, career, social } con files opcional.",
    ]);
  }

  const mapped = mapToSiteContent(payload);

  return {
    lang,
    ...mapped,
    siteContent: mapped.siteContent,
  };
}

async function getCachedRemotePortfolioData(baseUrl: string, lang: PortfolioLanguage) {
  const revalidateSeconds = getPortfolioCacheRevalidateSeconds();

  if (process.env.NODE_ENV === "test") {
    return loadRemotePortfolioData(baseUrl, lang, revalidateSeconds);
  }

  return unstable_cache(
    async () => loadRemotePortfolioData(baseUrl, lang, revalidateSeconds),
    [PORTFOLIO_CACHE_TAG, baseUrl, lang],
    {
      revalidate: revalidateSeconds,
      tags: [PORTFOLIO_CACHE_TAG, getPortfolioCacheTag(lang)],
    },
  )();
}

function mapToSiteContent(payload: PortfolioApiResponse): { siteContent: SiteContent; diagnostics: PortfolioDiagnostics } {
  const contentMap = getContentMap(payload.content);
  const socialMap = getSocialMap(payload.social);
  const fileMap = getFileMap(payload.files);
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
  const aboutBadge1Title = stripLeadingIconToken(extractTagText(getValue("about_badge_1"), "h4"));
  const aboutBadge1Description = stripLeadingIconToken(extractTagText(getValue("about_badge_1"), "p"));
  const aboutBadge2Title = stripLeadingIconToken(extractTagText(getValue("about_badge_2"), "h4"));
  const aboutBadge2Description = stripLeadingIconToken(extractTagText(getValue("about_badge_2"), "p"));
  const aboutBadge1IconKey = normalizeContentIconKey(extractInlineIconIdentifier(getValue("about_badge_1")));
  const aboutBadge2IconKey = normalizeContentIconKey(extractInlineIconIdentifier(getValue("about_badge_2")));
  const careerTitleLines = splitByBreaks(getValue("career_title"));
  const contactTitleLines = splitByBreaks(getValue("contact_title"));
  const photoTitleIconKey = normalizeContentIconKey(extractInlineIconIdentifier(getValue("photo_title")));
  const hispanoTitleIconKey = normalizeContentIconKey(extractInlineIconIdentifier(getValue("hispano_title")));

  const instagram = socialMap.get("photo_instagram");
  const linkedin = socialMap.get("linkedin");
  const github = socialMap.get("github");
  const resumeFile = payload.files?.find((item) => item.identifier === "resume");
  const brandLogoFile = fileMap.get("brand_logo");
  const profilePictureFile = fileMap.get("profile_picture");
  const hispanoBannerFile = fileMap.get("hispano_banner");
  const heroBackgroundFile = fileMap.get("hero_background") ?? fileMap.get("banner_background");
  const gamingLinksResult = buildOrderedSocialLinks(
    payload.social,
    GAMING_SOCIAL_IDENTIFIERS,
    fallbackSiteContent.gaming.links,
  );
  const footerLinksResult = buildOrderedSocialLinks(
    payload.social,
    FOOTER_SOCIAL_IDENTIFIERS,
    fallbackSiteContent.footerLinks,
  );

  if (!instagram) {
    warnings.push("Falta social identifier 'photo_instagram' para el CTA de fotografia.");
  }

  if (!linkedin || !github) {
    warnings.push("Faltan social identifiers 'linkedin' y/o 'github' para CTAs de contacto.");
  }

  if (!resumeFile?.file) {
    warnings.push("Falta files identifier 'resume' para el enlace de CV; se usa fallback local.");
  }

  if (!brandLogoFile?.file) {
    warnings.push("Falta files identifier 'brand_logo' para header/footer; se usa fallback local.");
  }

  if (!profilePictureFile?.file) {
    warnings.push("Falta files identifier 'profile_picture' para About; se usa fallback local.");
  }

  if (!hispanoBannerFile?.file) {
    warnings.push("Falta files identifier 'hispano_banner' para Comunidad Hispano; se usa fallback local.");
  }

  if (!heroBackgroundFile?.file) {
    warnings.push("Falta files identifier 'hero_background' para el fondo del Hero; se usa fallback local.");
  }

  if (gamingLinksResult.missingIdentifiers.length > 0) {
    warnings.push(
      `Faltan social identifiers de Hispano: ${gamingLinksResult.missingIdentifiers.join(", ")}. Se usan fallbacks locales para gaming.links.`,
    );
  }

  const sortedCareer = payload.career
    .filter((item) => item.enabled !== false)
    .sort((a, b) => a.prio_order - b.prio_order);

  const mappedExperience = sortedCareer.map((item) => ({
    period: item.from_until,
    role: item.position,
    company: item.company,
    companyUrl: item.company_url,
    companyLinkedin: item.company_linkedin,
    modality: item.modality,
    highlights: parseCareerHighlights(item),
    imageUrl: item.company_image,
  }));

  const passionsGallery = mapPassionsGallery(payload.files, fallbackSiteContent.passions.gallery).map((photo, index) => ({
    ...photo,
    title: pickText(`photo_gallery_${index + 1}_title`, photo.title),
  }));

  const siteContent: SiteContent = {
    ...fallbackSiteContent,
    brand: pickText("header_brand", fallbackSiteContent.brand),
    brandLogoUrl: brandLogoFile?.file || fallbackSiteContent.brandLogoUrl,
    navLinks: [
      { label: pickText("story_button", fallbackSiteContent.navLinks[0].label), href: "#about" },
      { label: pickText("career_button", fallbackSiteContent.navLinks[1].label), href: "#experience" },
      { label: pickText("passions_button", fallbackSiteContent.navLinks[2].label), href: "#passions" },
      { label: pickText("contact_button", fallbackSiteContent.navLinks[3].label), href: "#contact" },
    ],
    resumeUrl: resumeFile?.file || fallbackSiteContent.resumeUrl,
    resumeLabel: pickText("header_resume_button", fallbackSiteContent.resumeLabel),
    languageSwitcher: {
      enLabel: pickText("language_switcher_en_label", fallbackSiteContent.languageSwitcher.enLabel),
      esLabel: pickText("language_switcher_es_label", fallbackSiteContent.languageSwitcher.esLabel),
    },
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
      backgroundImageUrl: heroBackgroundFile?.file || fallbackSiteContent.hero.backgroundImageUrl,
    },
    about: {
      ...fallbackSiteContent.about,
      heading: aboutHeading || fallbackSiteContent.about.heading,
      paragraphs: aboutParagraphs.length > 0 ? aboutParagraphs : fallbackSiteContent.about.paragraphs,
      statusTitle: aboutStatusLines[0] ?? fallbackSiteContent.about.statusTitle,
      statusLabel: aboutStatusLines[1] ?? fallbackSiteContent.about.statusLabel,
      portraitUrl: profilePictureFile?.file || fallbackSiteContent.about.portraitUrl,
      features: [
        {
          title: aboutBadge1Title || fallbackSiteContent.about.features[0].title,
          description: aboutBadge1Description || fallbackSiteContent.about.features[0].description,
          iconKey: aboutBadge1IconKey
            ?? fallbackSiteContent.about.features[0].iconKey
            ?? inferAboutFeatureIconKey(
              aboutBadge1Title || fallbackSiteContent.about.features[0].title,
              aboutBadge1Description || fallbackSiteContent.about.features[0].description,
            ),
        },
        {
          title: aboutBadge2Title || fallbackSiteContent.about.features[1].title,
          description: aboutBadge2Description || fallbackSiteContent.about.features[1].description,
          iconKey: aboutBadge2IconKey
            ?? fallbackSiteContent.about.features[1].iconKey
            ?? inferAboutFeatureIconKey(
              aboutBadge2Title || fallbackSiteContent.about.features[1].title,
              aboutBadge2Description || fallbackSiteContent.about.features[1].description,
            ),
        },
      ],
    },
    experienceSection: {
      eyebrow: pickText("career_subtitle", fallbackSiteContent.experienceSection.eyebrow),
      title: careerTitleLines[0] ?? fallbackSiteContent.experienceSection.title,
      highlightedTitle: careerTitleLines[1] ?? fallbackSiteContent.experienceSection.highlightedTitle,
      description: pickText("career_description", fallbackSiteContent.experienceSection.description),
    },
    experienceShowMoreLabel: pickText("experience_show_more_button", fallbackSiteContent.experienceShowMoreLabel),
    experience: mappedExperience.length > 0 ? mappedExperience : fallbackSiteContent.experience,
    passions: {
      ...fallbackSiteContent.passions,
      heading: stripLeadingIconToken(pickText("photo_title", fallbackSiteContent.passions.heading)),
      iconKey: photoTitleIconKey ?? fallbackSiteContent.passions.iconKey,
      description: pickText("photo_description", fallbackSiteContent.passions.description),
      instagramHandle: pickText("photo_instagram", fallbackSiteContent.passions.instagramHandle),
      instagramUrl: instagram?.url ?? fallbackSiteContent.passions.instagramUrl,
      viewPostLabel: pickText("photo_view_post_label", fallbackSiteContent.passions.viewPostLabel),
      gallery: passionsGallery,
    },
    gaming: {
      ...fallbackSiteContent.gaming,
      heading: stripLeadingIconToken(pickText("hispano_title", fallbackSiteContent.gaming.heading)),
      iconKey: hispanoTitleIconKey ?? fallbackSiteContent.gaming.iconKey,
      description: pickText("hispano_description", fallbackSiteContent.gaming.description),
      links: gamingLinksResult.links,
      imageUrl: hispanoBannerFile?.file || fallbackSiteContent.gaming.imageUrl,
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
      details: [
        {
          label: pickText("contact_base_label", fallbackSiteContent.contact.details[0].label),
          value: pickText("contact_base_value", fallbackSiteContent.contact.details[0].value),
        },
        {
          label: pickText("contact_currently_reading_label", fallbackSiteContent.contact.details[1].label),
          value: pickText("contact_currently_reading_value", fallbackSiteContent.contact.details[1].value),
        },
      ],
    },
    seo: {
      title: pickText("seo_title", fallbackSiteContent.seo.title),
      description: pickText("seo_description", fallbackSiteContent.seo.description),
      openGraphDescription: pickText("seo_open_graph_description", fallbackSiteContent.seo.openGraphDescription),
      siteName: pickText("seo_site_name", fallbackSiteContent.seo.siteName),
    },
    manifest: {
      name: pickText("manifest_name", fallbackSiteContent.manifest.name),
      shortName: pickText("manifest_short_name", fallbackSiteContent.manifest.shortName),
      description: pickText("manifest_description", fallbackSiteContent.manifest.description),
    },
    footerBrand: pickText("footer_brand", fallbackSiteContent.footerBrand),
    footerNote: pickText("footer_note", fallbackSiteContent.footerNote),
    footerLinks: footerLinksResult.links,
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
    const fallbackResult = createFallbackResult(lang, ["Define PORTFOLIO_API_BASE_URL para consumir el backend de portfolio."]);
    reportDiagnostics(lang, fallbackResult.diagnostics);
    return fallbackResult;
  }

  try {
    const result = await getCachedRemotePortfolioData(baseUrl, lang);
    reportDiagnostics(lang, result.diagnostics);
    return result;
  } catch (error) {
    const fallbackWarnings = error instanceof PortfolioLoadError
      ? error.warnings
      : [`No fue posible conectar al backend: ${error instanceof Error ? error.message : "Error desconocido"}`];
    const fallbackResult = createFallbackResult(lang, fallbackWarnings);
    reportDiagnostics(lang, fallbackResult.diagnostics);
    return fallbackResult;
  }
}








