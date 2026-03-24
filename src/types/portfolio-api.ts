export type PortfolioLanguage = "en" | "es";

export const EXPECTED_CONTENT_TYPES = [
  "header_brand",
  "story_button",
  "career_button",
  "passions_button",
  "contact_button",
  "header_resume_button",
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
  "experience_show_more_button",
  "photo_title",
  "photo_description",
  "photo_instagram",
  "photo_gallery_1_title",
  "photo_gallery_2_title",
  "photo_gallery_3_title",
  "hispano_title",
  "hispano_description",
  "hispano_badge_1",
  "hispano_badge_2",
  "contact_title",
  "contact_description",
  "contact_base_label",
  "contact_base_value",
  "contact_currently_reading_label",
  "contact_currently_reading_value",
  "language_switcher_en_label",
  "language_switcher_es_label",
  "seo_title",
  "seo_description",
  "seo_open_graph_description",
  "seo_site_name",
  "manifest_name",
  "manifest_short_name",
  "manifest_description",
  "footer_brand",
  "footer_note",
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

export type PortfolioFileItem = {
  identifier: string;
  title: string;
  description: string;
  file: string;
};

export type PortfolioApiResponse = {
  content: PortfolioContentItem[];
  career: PortfolioCareerItem[];
  social: PortfolioSocialItem[];
  files?: PortfolioFileItem[];
};

export type PortfolioDiagnostics = {
  missingContentTypes: ExpectedContentType[];
  duplicateContentTypes: string[];
  unknownContentTypes: string[];
  warnings: string[];
};

 