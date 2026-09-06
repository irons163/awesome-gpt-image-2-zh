import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  apiRouteForFile,
  createProductionServer,
  discoverApiRoutes,
  parsePort,
  safeStaticPath
} from './production-server.mjs';

async function request(port, requestPath, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: requestPath,
      method: options.method || 'GET',
      headers: options.headers
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: Buffer.concat(chunks).toString('utf8')
      }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

test('production server maps APIs, preserves raw bodies, and serves the SPA', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'gpt-image-server-'));
  const apiRoot = path.join(root, 'api');
  const distRoot = path.join(root, 'dist');
  await Promise.all([
    mkdir(path.join(apiRoot, 'raw'), { recursive: true }),
    mkdir(path.join(apiRoot, '_lib'), { recursive: true }),
    mkdir(distRoot, { recursive: true })
  ]);
  await Promise.all([
    writeFile(path.join(distRoot, 'index.html'), '<h1>SPA</h1>'),
    writeFile(path.join(distRoot, 'hello.txt'), 'hello'),
    writeFile(path.join(apiRoot, 'echo.js'), `export default async function (req, res) {
      res.status(200).json({ query: req.query.value, method: req.method });
    }`),
    writeFile(path.join(apiRoot, 'raw', 'notify.js'), `export default async function (req, res) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      res.status(200).send(Buffer.concat(chunks));
    }`),
    writeFile(path.join(apiRoot, 'redirect.js'), `export default async function (req, res) {
      res.redirect(302, '/destination');
    }`),
    writeFile(path.join(apiRoot, '_lib', 'hidden.js'), 'export default () => {}'),
    writeFile(path.join(apiRoot, 'ignored.test.js'), 'export default () => {}')
  ]);

  const routes = await discoverApiRoutes(apiRoot);
  assert.deepEqual(
    [...routes.keys()].sort(),
    ['/api/echo', '/api/raw/notify', '/api/redirect']
  );
  assert.equal(apiRouteForFile(apiRoot, path.join(apiRoot, '_lib', 'hidden.js')), null);
  assert.equal(safeStaticPath(distRoot, '/../outside'), null);
  assert.equal(parsePort(undefined), 4174);
  assert.throws(() => parsePort('invalid'), /Invalid PORT/);

  const server = await createProductionServer({ apiRoot, distRoot, logger: { error() {} } });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(async () => {
    await new Promise((resolve) => {
      server.close(resolve);
      server.closeAllConnections();
    });
    await rm(root, { recursive: true, force: true });
  });
  const { port } = server.address();

  const api = await request(port, '/api/echo?value=ok');
  assert.equal(api.status, 200);
  assert.equal(api.headers['cache-control'], 'no-store, private, max-age=0');
  assert.equal(api.headers.pragma, 'no-cache');
  assert.deepEqual(JSON.parse(api.body), { query: 'ok', method: 'GET' });

  const raw = await request(port, '/api/raw/notify', {
    method: 'POST',
    body: 'signed=raw+body',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  assert.equal(raw.status, 200);
  assert.equal(raw.body, 'signed=raw+body');

  const redirect = await request(port, '/api/redirect');
  assert.equal(redirect.status, 302);
  assert.equal(redirect.headers.location, '/destination');

  const missingApi = await request(port, '/api/missing');
  assert.equal(missingApi.status, 404);
  assert.deepEqual(JSON.parse(missingApi.body), { ok: false, error: 'NOT_FOUND' });

  const asset = await request(port, '/hello.txt');
  assert.equal(asset.status, 200);
  assert.equal(asset.body, 'hello');
  assert.match(asset.headers['content-type'], /^text\/plain/);

  const head = await request(port, '/hello.txt', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(head.body, '');
  assert.equal(head.headers['content-length'], '5');

  const fallback = await request(port, '/community/result');
  assert.equal(fallback.status, 200);
  assert.equal(fallback.body, '<h1>SPA</h1>');

  const traversal = await request(port, '/%2e%2e/outside');
  assert.equal(traversal.status, 200);
  assert.equal(traversal.body, '<h1>SPA</h1>');
});
