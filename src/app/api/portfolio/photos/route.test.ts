import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("portfolio photos proxy", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubEnv("PORTFOLIO_API_BASE_URL", "https://backend.example.com");
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("maps fresh photos and bounds upstream requests without a second cache", async () => {
    fetchMock.mockResolvedValue(Response.json([{
      id: "1", caption: "Landscape", image_url: "https://cdn.example.com/a.jpg",
      permalink: "https://instagram.com/p/1", published_at: "2026-10-03",
    }]));
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{
      title: "Landscape", imageUrl: "https://cdn.example.com/a.jpg",
      href: "https://instagram.com/p/1", featured: true,
    }]);
    expect(fetchMock).toHaveBeenCalledWith(new URL("https://backend.example.com/portfolio/photos"), {
      cache: "no-store", signal: expect.any(AbortSignal), headers: { Accept: "application/json" },
    });
  });

  it("reports backend outages as 503 instead of a successful empty gallery", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 503 }));
    const response = await GET();
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual([]);
  });

  it("handles request timeouts while allowing the UI to retain local photos", async () => {
    fetchMock.mockRejectedValue(new DOMException("Timed out", "TimeoutError"));
    expect((await GET()).status).toBe(503);
  });
});
