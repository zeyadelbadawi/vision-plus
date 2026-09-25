// Minimal static server for the exported site (clean URLs + 404.html), used for local review and E2E.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const ROOT = 'out';
const PORT = Number(process.env.PORT ?? 4173);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.txt': 'text/plain', '.ico': 'image/x-icon' };

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  const safe = normalize(url).replace(/^(\.\.[/\\])+/, '');
  const candidates = [join(ROOT, safe), join(ROOT, `${safe}.html`), join(ROOT, safe, 'index.html')];
  const file = candidates.find((p) => existsSync(p) && statSync(p).isFile());
  if (!file) {
    res.writeHead(404, { 'content-type': TYPES['.html'] });
    return res.end(existsSync(join(ROOT, '404.html')) ? readFileSync(join(ROOT, '404.html')) : 'Not found');
  }
  const cache = file.includes('/_next/static/') ? 'public, max-age=31536000, immutable' : 'no-cache';
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'cache-control': cache });
  res.end(readFileSync(file));
}).listen(PORT, () => console.log(`serving ${ROOT}/ on http://localhost:${PORT}`));
