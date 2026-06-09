export function getSiteUrl() {
  const url = process.env.SITE_URL;
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  if (!url && process.env.NODE_ENV === "production" && !isBuildPhase) {
    throw new Error("SITE_URL must be set in production");
  }
  return url ?? "http://localhost:3000";
}

