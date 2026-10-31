#!/usr/bin/env node
/**
 * Tiny static file server for production dist/ on port 3100.
 * Proxies /v1, /health, /openapi.yaml to the TimeCraft backend so the
 * browser can call the API same-origin (avoids CORS).
 *
 * Usage: PORT=3100 node scripts/serve.mjs
 * Env:   BACKEND_URL=https://back.timecraft.meditum.eu (default)
 */
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootCandidates = [
  path.resolve(process.cwd(), 'dist'),
  path.resolve(__dirname, '..', 'dist'),
  path.resolve(process.cwd()),
];

const root = rootCandidates.find((dir) => fs.existsSync(path.join(dir, 'index.html')));
if (!root) {
  console.error(
    'Cannot find index.html. Build first (npm run build) or run from release folder with dist/.'
  );
  process.exit(1);
}

const port = Number(process.env.PORT || 3100);
const backendUrl = (process.env.BACKEND_URL || 'https://back.timecraft.meditum.eu').replace(
  /\/$/,
  ''
);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
  '.ico': 'image/x-icon',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function shouldProxy(urlPath) {
  return (
    urlPath === '/health' ||
    urlPath.startsWith('/v1/') ||
    urlPath === '/openapi.yaml' ||
    urlPath === '/openapi.json'
  );
}

function proxyToBackend(req, res) {
  const target = new URL(req.url || '/', backendUrl);
  const transport = target.protocol === 'https:' ? https : http;
  const headers = { ...req.headers, host: target.host };
  delete headers['accept-encoding'];

  const proxyReq = transport.request(
    target,
    { method: req.method, headers },
    (proxyRes) => {
      const outHeaders = { ...proxyRes.headers };
      // Ensure browser can read proxied JSON from same origin
      delete outHeaders['access-control-allow-origin'];
      delete outHeaders['access-control-allow-credentials'];
      res.writeHead(proxyRes.statusCode || 502, outHeaders);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err.message);
    send(res, 502, JSON.stringify({ message: 'Backend proxy error', error: err.message }), {
      'Content-Type': 'application/json',
    });
  });

  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

    if (shouldProxy(urlPath)) {
      return proxyToBackend(req, res);
    }

    let filePath = path.join(root, urlPath === '/' ? 'index.html' : urlPath);

    if (!filePath.startsWith(root)) {
      return send(res, 403, 'Forbidden');
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      // SPA fallback
      filePath = path.join(root, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const data = fs.readFileSync(filePath);
    send(res, 200, data, {
      'Content-Type': mime[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
  } catch (err) {
    console.error(err);
    send(res, 500, 'Internal Server Error');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`TimeCraft static server: http://0.0.0.0:${port}  (root=${root})`);
  console.log(`API proxy: ${backendUrl}  (/v1, /health, /openapi.yaml)`);
});
