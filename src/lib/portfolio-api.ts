import { siteContent as fallbackSiteContent } from "@/data/portfolio";
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
  const aboutBadge1Title = extractTagText(getValue("about_badge_1"), "h4");
  const aboutBadge1Description = extractTagText(getValue("about_badge_1"), "p");
  const aboutBadge2Title = extractTagText(getValue("about_badge_2"), "h4");
  const aboutBadge2Description = extractTagText(getValue("about_badge_2"), "p");
  const careerTitleLines = splitByBreaks(getValue("career_title"));
  const contactTitleLines = splitByBreaks(getValue("contact_title"));

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
    highlights: parseCareerHighlights(item),
    imageUrl: item.company_image,
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
    experienceShowMoreLabel: pickText("experience_show_more_button", fallbackSiteContent.experienceShowMoreLabel),
    experience: mappedExperience.length > 0 ? mappedExperience : fallbackSiteContent.experience,
    passions: {
      ...fallbackSiteContent.passions,
      heading: pickText("photo_title", fallbackSiteContent.passions.heading),
      description: pickText("photo_description", fallbackSiteContent.passions.description),
      instagramHandle: pickText("photo_instagram", fallbackSiteContent.passions.instagramHandle),
      instagramUrl: instagram?.url ?? fallbackSiteContent.passions.instagramUrl,
      gallery: fallbackSiteContent.passions.gallery.map((photo, index) => ({
        ...photo,
        title: pickText(`photo_gallery_${index + 1}_title`, photo.title),
      })),
    },
    gaming: {
      ...fallbackSiteContent.gaming,
      heading: pickText("hispano_title", fallbackSiteContent.gaming.heading),
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
        warnings: ["Respuesta invalida del backend: se esperaba { content, career, social } con files opcional."],
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
      siteContent: mapped.siteContent,
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








