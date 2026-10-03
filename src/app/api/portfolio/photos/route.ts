import { NextResponse } from "next/server";

import { mapPortfolioPhotosToGallery } from "@/lib/portfolio-photos";

const PHOTOS_REQUEST_TIMEOUT_MS = 12000;
const errorResponse = () => NextResponse.json([], {
  status: 503,
  headers: { "Cache-Control": "no-store" },
});

export async function GET() {
  const baseUrl = process.env.PORTFOLIO_API_BASE_URL;

  if (!baseUrl) {
    return errorResponse();
  }

  try {
    const endpoint = new URL("/portfolio/photos", baseUrl);
    const response = await fetch(endpoint, {
      // The backend already caches photos. Avoid retaining an outage here too.
      cache: "no-store",
      signal: AbortSignal.timeout(PHOTOS_REQUEST_TIMEOUT_MS),
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return errorResponse();
    }

    const payload: unknown = await response.json();
    const gallery = mapPortfolioPhotosToGallery(payload);

    return NextResponse.json(gallery, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return errorResponse();
  }
}

