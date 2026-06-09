export function getSiteUrl() {
  const url = process.env.SITE_URL;
  if (!url && process.env.NODE_ENV === "production") {
    throw new Error("SITE_URL must be set in production");
  }
  return url ?? "http://localhost:3000";
}

