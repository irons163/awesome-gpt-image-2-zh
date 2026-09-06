import { createReadStream } from 'node:fs';
import { readdir, realpath, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pipeline } from 'node:stream/promises';

const DEFAULT_PORT = 4174;
const DEFAULT_HOST = '127.0.0.1';
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');

const MIME_TYPES = new Map([
  ['.avif', 'image/avif'],
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2']
]);

export function parsePort(value, fallback = DEFAULT_PORT) {
  if (value === undefined || value === null || value === '') return fallback;
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${value}`);
  }
  return port;
}

export function apiRouteForFile(apiRoot, filePath) {
  const relative = path.relative(path.resolve(apiRoot), path.resolve(filePath));
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) return null;

  const segments = relative.split(path.sep);
  const filename = segments.at(-1) || '';
  if (segments.includes('_lib') || !filename.endsWith('.js') || filename.endsWith('.test.js')) {
    return null;
  }

  const routeSegments = segments.map((segment, index) => (
    index === segments.length - 1 ? segment.slice(0, -3) : segment
  ));
  return `/api/${routeSegments.join('/')}`;
}

export async function discoverApiRoutes(apiRoot = path.join(PROJECT_ROOT, 'api')) {
  const root = path.resolve(apiRoot);
  const routes = new Map();
  const directories = [root];

  while (directories.length) {
    const directory = directories.pop();
    let entries;
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error?.code === 'ENOENT') throw new Error(`API directory does not exist: ${root}`);
      throw error;
    }

    for (const entry of entries) {
      const filePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== '_lib') directories.push(filePath);
        continue;
      }
      if (!entry.isFile()) continue;

      const route = apiRouteForFile(root, filePath);
      if (!route) continue;
      if (routes.has(route)) throw new Error(`Duplicate API route: ${route}`);

      let handlerPromise;
      routes.set(route, async () => {
        handlerPromise ||= import(pathToFileURL(filePath).href).then((module) => {
          if (typeof module.default !== 'function') {
            throw new TypeError(`API module has no default handler: ${filePath}`);
          }
          return module.default;
        });
        return handlerPromise;
      });
    }
  }

  return routes;
}

export function attachResponseHelpers(res) {
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };
  res.json = (payload) => {
    if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
    return res;
  };
  res.send = (payload = '') => {
    if (payload !== null && typeof payload === 'object'
      && !Buffer.isBuffer(payload) && !ArrayBuffer.isView(payload)) {
      return res.json(payload);
    }
    res.end(payload === null ? '' : payload);
    return res;
  };
  res.redirect = (statusOrLocation, maybeLocation) => {
    const hasStatus = typeof statusOrLocation === 'number';
    res.statusCode = hasStatus ? statusOrLocation : 307;
    res.setHeader('Location', hasStatus ? maybeLocation : statusOrLocation);
    res.end();
    return res;
  };
  return res;
}

export function contentTypeFor(filePath) {
  return MIME_TYPES.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream';
}

export function safeStaticPath(distRoot, requestPathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(requestPathname);
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;

  const root = path.resolve(distRoot);
  const relative = decoded.replace(/^[/\\]+/, '');
  const candidate = path.resolve(root, relative || 'index.html');
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) return null;
  return candidate;
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

async function existingSafeFile(distRoot, requestPathname) {
  const candidate = safeStaticPath(distRoot, requestPathname);
  if (!candidate) return null;

  try {
    const metadata = await stat(candidate);
    if (!metadata.isFile()) return null;

    const [realRoot, realCandidate] = await Promise.all([realpath(distRoot), realpath(candidate)]);
    if (realCandidate !== realRoot && !realCandidate.startsWith(`${realRoot}${path.sep}`)) return null;
    return { filePath: realCandidate, metadata };
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') return null;
    throw error;
  }
}

async function sendFile(req, res, file) {
  res.statusCode = 200;
  res.setHeader('Content-Type', contentTypeFor(file.filePath));
  res.setHeader('Content-Length', String(file.metadata.size));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader(
    'Cache-Control',
    path.basename(file.filePath) === 'index.html'
      ? 'no-cache'
      : file.filePath.includes(`${path.sep}assets${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600'
  );

  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  await pipeline(createReadStream(file.filePath), res);
}

function normalizedApiPath(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

export async function createProductionServer({
  apiRoot = path.join(PROJECT_ROOT, 'api'),
  distRoot = path.join(PROJECT_ROOT, 'dist'),
  logger = console
} = {}) {
  const resolvedDistRoot = path.resolve(distRoot);
  const routes = await discoverApiRoutes(apiRoot);
  const indexFile = await existingSafeFile(resolvedDistRoot, '/index.html');
  if (!indexFile) throw new Error(`Built index does not exist: ${path.join(resolvedDistRoot, 'index.html')}`);

  return http.createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
      const pathname = requestUrl.pathname;

      if (pathname === '/api' || pathname.startsWith('/api/')) {
        const routeLoader = routes.get(normalizedApiPath(pathname));
        if (!routeLoader) {
          sendJson(res, 404, { ok: false, error: 'NOT_FOUND' });
          return;
        }

        req.query = Object.fromEntries(requestUrl.searchParams.entries());
        res.setHeader('Cache-Control', 'no-store, private, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        attachResponseHelpers(res);
        const handler = await routeLoader();
        await handler(req, res);
        if (!res.writableEnded) res.end();
        return;
      }

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.statusCode = 405;
        res.setHeader('Allow', 'GET, HEAD');
        res.end('Method Not Allowed');
        return;
      }

      const requestedFile = await existingSafeFile(resolvedDistRoot, pathname);
      await sendFile(req, res, requestedFile || indexFile);
    } catch (error) {
      logger.error?.('Production request failed', {
        method: req.method,
        path: String(req.url || '').split('?', 1)[0],
        message: String(error?.message || 'unknown').slice(0, 240)
      });
      if (!res.headersSent) {
        sendJson(res, 500, { ok: false, error: 'INTERNAL_SERVER_ERROR' });
      } else if (!res.writableEnded) {
        res.destroy();
      }
    }
  });
}

export async function startProductionServer(options = {}) {
  const server = await createProductionServer(options);
  const port = parsePort(options.port ?? process.env.PORT);
  const host = options.host ?? process.env.HOST ?? DEFAULT_HOST;
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      server.off('error', reject);
      resolve();
    });
  });
  return server;
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  const server = await startProductionServer();
  const address = server.address();
  const host = typeof address === 'object' && address ? address.address : DEFAULT_HOST;
  console.log(`Production server listening on http://${host}:${address.port}`);

  const stop = () => server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}
