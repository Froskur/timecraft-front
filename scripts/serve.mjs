#!/usr/bin/env node
/**
 * Tiny static file server for production dist/ on port 3100.
 * Usage: node scripts/serve.mjs   (from package root or release folder)
 */
import http from 'node:http';
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
  console.error('Cannot find index.html. Build first (npm run build) or run from release folder with dist/.');
  process.exit(1);
}

const port = Number(process.env.PORT || 3100);

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

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
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
});
