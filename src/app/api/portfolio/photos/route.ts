import { NextResponse } from "next/server";

import { mapPortfolioPhotosToGallery } from "@/lib/portfolio-photos";

const PHOTOS_REVALIDATE_SECONDS = 300;

export async function GET() {
  const baseUrl = process.env.PORTFOLIO_API_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json([]);
  }

  try {
    const endpoint = new URL("/portfolio/photos", baseUrl);
    const response = await fetch(endpoint, {
      next: { revalidate: PHOTOS_REVALIDATE_SECONDS },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json([]);
    }

    const payload: unknown = await response.json();
    const gallery = mapPortfolioPhotosToGallery(payload);

    return NextResponse.json(gallery);
  } catch {
    return NextResponse.json([]);
  }
}

