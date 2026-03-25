import { describe, expect, it } from "vitest";

import { mapPortfolioPhotosToGallery } from "@/lib/portfolio-photos";

describe("mapPortfolioPhotosToGallery", () => {
  it("maps backend photo payload into photo cards", () => {
    const result = mapPortfolioPhotosToGallery([
      {
        id: "1",
        caption: "obstaculo",
        image_url: "https://scontent.cdninstagram.com/a.jpg",
        permalink: "https://instagram.com/p/1",
        published_at: "2026-03-24T21:30:00+0000",
      },
      {
        id: "2",
        caption: "",
        image_url: "https://scontent.cdninstagram.com/b.jpg",
        permalink: "https://instagram.com/p/2",
        published_at: "2026-03-23T21:30:00+0000",
      },
    ]);

    expect(result).toEqual([
      {
        title: "obstaculo",
        imageUrl: "https://scontent.cdninstagram.com/a.jpg",
        href: "https://instagram.com/p/1",
        featured: true,
      },
      {
        title: "Instagram photo",
        imageUrl: "https://scontent.cdninstagram.com/b.jpg",
        href: "https://instagram.com/p/2",
        featured: false,
      },
    ]);
  });

  it("returns [] for invalid payload", () => {
    expect(mapPortfolioPhotosToGallery({})).toEqual([]);
    expect(mapPortfolioPhotosToGallery([{"invalid": true}])).toEqual([]);
  });
});

