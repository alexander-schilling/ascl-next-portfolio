import { pathToFileURL } from 'node:url';

export async function deployDokploy(env = process.env, request = fetch) {
  for (const name of ['BASE_URL', 'API_KEY', 'APP_ID', 'IMAGE_NAME', 'IMAGE_DIGEST']) {
    if (!env[name]?.trim()) throw new Error(`Missing deployment setting: ${name}`);
  }
  if (!/^sha256:[a-f0-9]{64}$/.test(env.IMAGE_DIGEST)) {
    throw new Error('Invalid build image digest');
  }
  const baseUrl = env.BASE_URL.replace(/\/+$/, '');
  const dockerImage = `${env.IMAGE_NAME}@${env.IMAGE_DIGEST}`;

  async function mutation(procedure, input) {
    let response;
    try {
      response = await request(`${baseUrl}/api/trpc/${procedure}`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'x-api-key': env.API_KEY,
        },
        body: JSON.stringify({ json: input }),
        signal: AbortSignal.timeout(30_000),
      });
    } catch {
      throw new Error(`Dokploy ${procedure} request failed`);
    }
    if (!response.ok) {
      throw new Error(`Dokploy ${procedure} failed (HTTP ${response.status})`);
    }
    const payload = await response.json().catch(() => null);
    if (!payload?.result || payload.error) {
      throw new Error(`Dokploy ${procedure} returned an invalid or failed response`);
    }
  }

  // Update only the image; preserve environment, registry credentials and domains.
  await mutation('application.update', { applicationId: env.APP_ID, dockerImage });
  await mutation('application.deploy', { applicationId: env.APP_ID });
  console.log(`Dokploy deployment queued for ${dockerImage}`);
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  deployDokploy().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
