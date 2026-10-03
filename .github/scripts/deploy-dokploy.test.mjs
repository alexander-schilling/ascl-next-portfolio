import assert from 'node:assert/strict';
import test from 'node:test';
import { deployDokploy } from './deploy-dokploy.mjs';

const env = {
  BASE_URL: 'https://dokploy.example/',
  API_KEY: 'test-key',
  APP_ID: 'test-app',
  IMAGE_NAME: 'example/backend',
  IMAGE_DIGEST: `sha256:${'a'.repeat(64)}`,
};

test('updates the exact built image before queuing a deploy, without changing other settings', async () => {
  const calls = [];
  await deployDokploy(env, async (url, options) => {
    calls.push({ url, input: JSON.parse(options.body).json });
    assert.equal(options.headers['x-api-key'], env.API_KEY);
    return new Response(JSON.stringify({ result: { data: { json: true } } }));
  });
  assert.deepEqual(calls, [
    { url: 'https://dokploy.example/api/trpc/application.update', input: {
      applicationId: env.APP_ID, dockerImage: `${env.IMAGE_NAME}@${env.IMAGE_DIGEST}`,
    } },
    { url: 'https://dokploy.example/api/trpc/application.deploy', input: { applicationId: env.APP_ID } },
  ]);
});

test('does not deploy if selecting the image fails with HTTP 403', async () => {
  let calls = 0;
  await assert.rejects(deployDokploy(env, async () => {
    calls++;
    return new Response('Forbidden', { status: 403 });
  }), /application.update failed \(HTTP 403\)/);
  assert.equal(calls, 1);
});

test('does not deploy if the API returns an error inside HTTP 200', async () => {
  let calls = 0;
  await assert.rejects(deployDokploy(env, async () => {
    calls++;
    return new Response(JSON.stringify({ error: { message: 'failure' } }));
  }), /application.update returned an invalid or failed response/);
  assert.equal(calls, 1);
});

test('rejects an absent build digest before touching Dokploy', async () => {
  let calls = 0;
  await assert.rejects(deployDokploy({ ...env, IMAGE_DIGEST: 'latest' }, async () => {
    calls++;
  }), /Invalid build image digest/);
  assert.equal(calls, 0);
});
