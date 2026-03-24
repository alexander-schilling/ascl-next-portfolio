import { decode } from "html-entities";

const HTML_TAG_REGEX = /<[^>]*>/g;
const WHITESPACE_REGEX = /\s+/g;

export function decodeHtmlEntities(value: string) {
  return decode(value);
}

export function stripHtml(value: string) {
  return decodeHtmlEntities(value.replace(HTML_TAG_REGEX, " ").replace(WHITESPACE_REGEX, " ")).trim();
}

