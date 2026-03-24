export type NavLink = {
  label: string;
  href: string;
};

export type HeroContent = {
  badge: string;
  title: string;
  highlightedTitle: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  backgroundImageUrl: string;
};

export type AboutFeature = {
  title: string;
  description: string;
};

export type AboutContent = {
  heading: string;
  paragraphs: string[];
  statusTitle: string;
  statusLabel: string;
  portraitUrl: string;
  features: AboutFeature[];
};

export type ExperienceEntry = {
  period: string;
  role: string;
  company: string;
  highlights: string[];
  imageUrl?: string;
  hidden?: boolean;
};

export type ExperienceSectionContent = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
};

export type PhotoCard = {
  title: string;
  imageUrl: string;
  featured?: boolean;
};

export type PassionContent = {
  heading: string;
  description: string;
  instagramUrl: string;
  instagramHandle: string;
  gallery: PhotoCard[];
};

export type GamingLink = {
  label: string;
  href: string;
};

export type GamingContent = {
  heading: string;
  description: string;
  stats: Array<{ label: string; value: string }>;
  links: GamingLink[];
  imageUrl: string;
};

export type ContactContent = {
  heading: string;
  highlighted: string;
  description: string;
  ctas: Array<{ label: string; href: string }>;
  details: Array<{ label: string; value: string }>;
};

export type LanguageSwitcherContent = {
  enLabel: string;
  esLabel: string;
};

export type SeoContent = {
  title: string;
  description: string;
  openGraphDescription: string;
  siteName: string;
};

export type ManifestContent = {
  name: string;
  shortName: string;
  description: string;
};

export type SiteContent = {
  brand: string;
  brandLogoUrl: string;
  navLinks: NavLink[];
  resumeUrl: string;
  resumeLabel: string;
  languageSwitcher: LanguageSwitcherContent;
  hero: HeroContent;
  about: AboutContent;
  experienceSection: ExperienceSectionContent;
  experienceShowMoreLabel: string;
  experience: ExperienceEntry[];
  passions: PassionContent;
  gaming: GamingContent;
  contact: ContactContent;
  seo: SeoContent;
  manifest: ManifestContent;
  footerBrand: string;
  footerNote: string;
  footerLinks: Array<{ label: string; href: string }>;
};

