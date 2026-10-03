import assert from "node:assert/strict";

const origin = new URL(process.argv[2] ?? "https://alexanderschilling.cl").origin;
const canonicalOrigin = new URL(process.argv[3] ?? origin).origin;
const agents = ["Googlebot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot"];

async function fetchPublic(path, agent = "DiscoverabilityAudit/1.0", method = "GET") {
  const response = await fetch(`${origin}${path}`, {
    headers: { "User-Agent": agent }, method, signal: AbortSignal.timeout(20_000),
  });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status} for ${agent}`);
  assert.notEqual(response.headers.get("cf-mitigated"), "challenge", `${path}: CDN challenge`);
  assert.ok(!/noindex/i.test(response.headers.get("x-robots-tag") ?? ""), `${path}: X-Robots-Tag`);
  return response;
}

const robots = await (await fetchPublic("/robots.txt")).text();
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`), "robots.txt: public sitemap URL");
assert.ok(/User-Agent: \*\s+Allow: \//.test(robots), "robots.txt: public crawl permission");
assert.ok(!robots.includes("localhost"), "robots.txt: build origin leaked");
const sitemap = await (await fetchPublic("/sitemap.xml")).text();
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]).sort(),
  [`${canonicalOrigin}/en`, `${canonicalOrigin}/es`], "sitemap.xml: canonical language URLs");
assert.ok(!sitemap.includes("localhost"), "sitemap.xml: build origin leaked");
assert.ok(sitemap.includes('hreflang="es"') && sitemap.includes('hreflang="en"'), "sitemap.xml: language alternates");

for (const lang of ["es", "en"]) {
  for (const agent of agents) {
    const html = await (await fetchPublic(`/${lang}`, agent)).text();
    const body = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
    assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html), `${lang}: noindex`);
    assert.ok(body.includes(lang === "es" ? "Ingeniero de Datos Senior" : "Senior Data Engineer"), `${lang}: SSR career`);
    assert.ok(body.includes('href="mailto:contacto@alexanderschilling.cl"'), `${lang}: direct email`);
    assert.ok(body.includes(">contacto@alexanderschilling.cl</a>"), `${lang}: public email text`);
    assert.ok(body.includes('href="/es"') && body.includes('href="/en"'), `${lang}: native language links`);
    assert.ok(html.includes(`rel="canonical" href="${canonicalOrigin}/${lang}"`), `${lang}: canonical`);
    const rawSchema = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1];
    assert.ok(rawSchema, `${lang}: JSON-LD`);
    const schema = JSON.parse(rawSchema);
    assert.equal(schema["@type"], "ProfilePage");
    assert.equal(schema.mainEntity["@type"], "Person");
    assert.equal(schema.mainEntity.name, "Alexander Schilling");
    assert.equal(schema.mainEntity.email, "contacto@alexanderschilling.cl");
    assert.equal(schema.inLanguage, lang);
    assert.equal(schema.url, `${canonicalOrigin}/${lang}`);
    assert.ok(body.includes(schema.mainEntity.jobTitle), `${lang}: factual job title`);
    if (agent === agents[0]) {
      const cv = await fetch(schema.subjectOf.url, { method: "HEAD", signal: AbortSignal.timeout(20_000) });
      assert.equal(cv.status, 200, `${lang}: public CV`);
      assert.ok(cv.headers.get("content-type")?.includes("application/pdf"), `${lang}: CV format`);
    }
    console.log(`${lang} / ${agent}: HTML, contact, navigation and profile OK`);
  }
}
console.log("robots.txt, sitemap.xml and both CVs OK. User-Agent probes do not prove access from crawler IP ranges.");
