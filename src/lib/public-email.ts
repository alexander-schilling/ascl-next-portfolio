import { encode } from "html-entities";

import type { ContactContent } from "@/types/portfolio";

export function getPublicEmail(href: string): string | undefined {
  if (!href.startsWith("mailto:")) return undefined;
  try {
    const email = decodeURIComponent(href.slice(7).split("?")[0]);
    return /^[^\s<>"(),;:]+@[^\s<>"(),;:]+\.[^\s<>"(),;:]+$/.test(email) ? email : undefined;
  } catch {
    return undefined;
  }
}

export function getContactEmail(contact: ContactContent) {
  return contact.ctas.map((cta) => getPublicEmail(cta.href)).find(Boolean);
}

export function buildPublicEmailMarkup(email: string, className: string) {
  if (!getPublicEmail(`mailto:${email}`)) throw new Error("Invalid public email");
  // Cloudflare's documented exclusion needs real HTML comments enclosing the
  // complete link. Escape all CMS-derived values before inserting markup.
  return `<!--email_off--><a href="${encode(`mailto:${email}`)}" class="${encode(className)}">${encode(email)}</a><!--/email_off-->`;
}
