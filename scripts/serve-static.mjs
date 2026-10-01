// Minimal static server for the exported site (clean URLs + 404.html), used for local review and E2E.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const ROOT = 'out';
const PORT = Number(process.env.PORT ?? 4173);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json', '.avif': 'image/avif', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.txt': 'text/plain', '.ico': 'image/x-icon' };

const memo = new Map();
const compressed = (file, enc, buf) => {
  const key = `${enc}:${file}`;
  if (!memo.has(key)) memo.set(key, enc === 'br' ? brotliCompressSync(buf) : gzipSync(buf));
  return memo.get(key);
};

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
  const type = TYPES[extname(file)] ?? 'application/octet-stream';
  let body = readFileSync(file);
  const headers = { 'content-type': type, 'cache-control': cache, vary: 'Accept-Encoding' };
  // Compress text like Cloudflare does in production, so local Lighthouse numbers are representative.
  if (/text|javascript|json|svg/.test(type)) {
    const ae = String(req.headers['accept-encoding'] ?? '');
    if (ae.includes('br')) { body = compressed(file, 'br', body); headers['content-encoding'] = 'br'; }
    else if (ae.includes('gzip')) { body = compressed(file, 'gzip', body); headers['content-encoding'] = 'gzip'; }
  }
  res.writeHead(200, headers);
  res.end(body);
}).listen(PORT, () => console.log(`serving ${ROOT}/ on http://localhost:${PORT}`));
