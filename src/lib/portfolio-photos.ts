import type { PhotoCard } from "@/types/portfolio";

export type PortfolioPhotoApiItem = {
  id: string;
  caption: string;
  image_url: string;
  permalink: string;
  published_at: string;
};

const DEFAULT_PHOTO_TITLE = "Instagram photo";

function isPortfolioPhotoApiItem(value: unknown): value is PortfolioPhotoApiItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PortfolioPhotoApiItem>;

  return (
    typeof candidate.id === "string"
    && typeof candidate.caption === "string"
    && typeof candidate.image_url === "string"
    && typeof candidate.permalink === "string"
    && typeof candidate.published_at === "string"
  );
}

export function mapPortfolioPhotosToGallery(payload: unknown): PhotoCard[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .filter(isPortfolioPhotoApiItem)
    .filter((item) => item.image_url.trim().length > 0)
    .map((item, index) => ({
      title: item.caption.trim() || DEFAULT_PHOTO_TITLE,
      imageUrl: item.image_url,
      href: item.permalink,
      featured: index === 0,
    }));
}

