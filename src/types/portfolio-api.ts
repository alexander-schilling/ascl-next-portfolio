export type PortfolioLanguage = "en" | "es";

export const EXPECTED_CONTENT_TYPES = [
  "banner_badge",
  "banner_title",
  "banner_subtitle",
  "banner_story_button",
  "banner_work_button",
  "about_status",
  "about_content",
  "about_badge_1",
  "about_badge_2",
  "career_subtitle",
  "career_title",
  "career_description",
  "photo_title",
  "photo_description",
  "photo_instagram",
  "hispano_title",
  "hispano_description",
  "hispano_badge_1",
  "hispano_badge_2",
  "contact_title",
  "contact_description",
] as const;

export type ExpectedContentType = (typeof EXPECTED_CONTENT_TYPES)[number];

export type PortfolioContentItem = {
  type: string;
  content: string;
};

export type PortfolioCareerItem = {
  from_until: string;
  position: string;
  company: string;
  company_url?: string;
  company_linkedin?: string;
  company_image?: string;
  description: string;
  modality?: string;
  prio_order: number;
  enabled?: boolean;
};

export type PortfolioSocialItem = {
  identifier: string;
  label: string;
  url: string;
};

export type PortfolioApiResponse = {
  content: PortfolioContentItem[];
  career: PortfolioCareerItem[];
  social: PortfolioSocialItem[];
};

export type PortfolioDiagnostics = {
  missingContentTypes: ExpectedContentType[];
  duplicateContentTypes: string[];
  unknownContentTypes: string[];
  warnings: string[];
};

 