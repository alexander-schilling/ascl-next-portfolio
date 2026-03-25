import { createElement } from "react";
import type { IconType } from "react-icons";
import {
  FaBolt,
  FaCamera,
  FaChartLine,
  FaGamepad,
  FaLightbulb,
  FaMobileAlt,
  FaRocket,
  FaSitemap,
  FaTerminal,
  FaUsers,
} from "react-icons/fa";

export const CONTENT_ICON_KEYS = [
  "curiosity",
  "leadership",
  "insights",
  "groups",
  "architecture",
  "rocket_launch",
  "smartphone",
  "bolt",
  "camera",
  "joystick",
] as const;

export type ContentIconKey = (typeof CONTENT_ICON_KEYS)[number];

const CONTENT_ICON_MAP: Record<ContentIconKey, IconType> = {
  curiosity: FaTerminal,
  leadership: FaUsers,
  insights: FaChartLine,
  groups: FaUsers,
  architecture: FaSitemap,
  rocket_launch: FaRocket,
  smartphone: FaMobileAlt,
  bolt: FaBolt,
  camera: FaCamera,
  joystick: FaGamepad,
};

const CONTENT_ICON_ALIASES: Record<string, ContentIconKey> = {
  curiosity: "curiosity",
  terminal: "curiosity",
  code: "curiosity",
  leadership: "leadership",
  mentor: "leadership",
  insights: "insights",
  analytics: "insights",
  chart: "insights",
  groups: "groups",
  users: "groups",
  team: "groups",
  architecture: "architecture",
  system: "architecture",
  systems: "architecture",
  rocket: "rocket_launch",
  rocketlaunch: "rocket_launch",
  rocket_launch: "rocket_launch",
  launch: "rocket_launch",
  smartphone: "smartphone",
  mobile: "smartphone",
  phone: "smartphone",
  bolt: "bolt",
  performance: "bolt",
  speed: "bolt",
  camera: "camera",
  photography: "camera",
  photo: "camera",
  joystick: "joystick",
  gamepad: "joystick",
  gaming: "joystick",
};

function normalizeIconAlias(value: string) {
  return value.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function normalizeContentIconKey(value?: string | null): ContentIconKey | undefined {
  if (!value) {
    return undefined;
  }

  const normalizedValue = normalizeIconAlias(value);
  return CONTENT_ICON_ALIASES[normalizedValue];
}

export function getContentIcon(key?: string | null) {
  const normalizedKey = normalizeContentIconKey(key);
  return normalizedKey ? CONTENT_ICON_MAP[normalizedKey] : undefined;
}

type ContentIconProps = {
  iconKey?: string | null;
  fallbackIconKey?: ContentIconKey;
  className?: string;
  "aria-hidden"?: boolean;
};

export function ContentIcon({
  iconKey,
  fallbackIconKey,
  className,
  "aria-hidden": ariaHidden,
}: ContentIconProps) {
  const IconComponent = getContentIcon(iconKey) ?? (fallbackIconKey ? getContentIcon(fallbackIconKey) : undefined);

  if (!IconComponent) {
    return null;
  }

  return createElement(IconComponent, {
    className,
    "aria-hidden": ariaHidden,
  });
}

export function inferAboutFeatureIconKey(title: string, description = ""): ContentIconKey {
  const content = `${title} ${description}`.toLowerCase();

  if (content.includes("lead") || content.includes("mentor") || content.includes("team") || content.includes("talent")) {
    return "leadership";
  }

  if (content.includes("learn") || content.includes("curio") || content.includes("terminal") || content.includes("build")) {
    return "curiosity";
  }

  return "curiosity";
}

export function inferCareerHighlightIconKey(text: string): ContentIconKey {
  const content = text.toLowerCase();

  if (
    content.includes("mentor")
    || content.includes("team")
    || content.includes("ci/cd")
    || content.includes("deployment")
    || content.includes("cross-functional")
  ) {
    return "groups";
  }

  if (
    content.includes("architect")
    || content.includes("real-time")
    || content.includes("engine")
    || content.includes("system")
    || content.includes("pipeline")
  ) {
    return "architecture";
  }

  if (
    content.includes("launch")
    || content.includes("fortune 500")
    || content.includes("application")
    || content.includes("developed")
  ) {
    return "rocket_launch";
  }

  if (content.includes("mobile") || content.includes("downloads") || content.includes("app store")) {
    return "smartphone";
  }

  if (
    content.includes("lighthouse")
    || content.includes("performance")
    || content.includes("optimized")
    || content.includes("latency")
  ) {
    return "bolt";
  }

  if (content.includes("fraud") || content.includes("events/sec") || content.includes("insight") || content.includes("analytics")) {
    return "insights";
  }

  return "insights";
}

export function getAboutFeatureIconTone(iconKey?: string | null) {
  return normalizeContentIconKey(iconKey) === "leadership" ? "text-tertiary" : "text-secondary";
}

export function getSectionIconTone(iconKey?: string | null) {
  const normalizedKey = normalizeContentIconKey(iconKey);

  if (normalizedKey === "joystick") {
    return "text-tertiary";
  }

  return "text-primary";
}

export function getFallbackFeatureIcon() {
  return FaLightbulb;
}


