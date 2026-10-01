import { describe, expect, it } from 'vitest';
import { handle, type Env } from '../../worker/index';
import { matchAcceptLanguage, negotiateLocale, readLocaleCookie } from '../../worker/locale';

const env = (over: Partial<Env> = {}): Env => ({
  SITE_ENV: 'preview',
  ASSETS: { fetch: async () => new Response('asset', { status: 200 }) },
  ...over,
});
const req = (path: string, init: RequestInit = {}) => new Request(`https://example.test${path}`, init);

describe('locale negotiation', () => {
  it('prefers a valid NEXT_LOCALE cookie, then Accept-Language, then en', () => {
    expect(negotiateLocale('a=1; NEXT_LOCALE=ar', 'zh-CN')).toBe('ar');
    expect(negotiateLocale('NEXT_LOCALE=fr', 'zh-CN,zh;q=0.9')).toBe('zh');
    expect(negotiateLocale(null, 'de-DE,fr;q=0.8')).toBe('en');
    expect(negotiateLocale(null, null)).toBe('en');
  });
  it('honours q-values and maps regional/script tags to the base locale', () => {
    expect(matchAcceptLanguage('en;q=0.5, ar-EG;q=0.9')).toBe('ar');
    expect(matchAcceptLanguage('zh-Hant-TW')).toBe('zh');
    expect(matchAcceptLanguage('ar;q=0, en')).toBe('en');
    expect(matchAcceptLanguage('*')).toBeNull();
  });
  it('ignores malformed cookies', () => {
    expect(readLocaleCookie('NEXT_LOCALE=%E0%A4%A')).toBeNull();
  });
});

describe('worker routing', () => {
  it('redirects / to the negotiated locale, keeping the query, uncached and Vary-ing', async () => {
    const res = await handle(req('/?utm=x', { headers: { 'Accept-Language': 'ar' } }), env());
    expect(res.status).toBe(302);
    expect(res.headers.get('Location')).toBe('/ar?utm=x');
    expect(res.headers.get('Vary')).toContain('Accept-Language');
    expect(res.headers.get('Cache-Control')).toContain('no-store');
  });
  it('serves a side-effect-free health check and rejects other methods', async () => {
    const ok = await handle(req('/api/contact/health'), env({ BUILD_ID: 'abc' }));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toEqual({ status: 'ok', service: 'vision-plus-web', environment: 'preview', build: 'abc' });
    const post = await handle(req('/api/contact/health', { method: 'POST' }), env());
    expect(post.status).toBe(405);
    expect(post.headers.get('Allow')).toBe('GET, HEAD');
  });
  it('returns JSON 404 for unknown API routes', async () => {
    const res = await handle(req('/api/nope'), env());
    expect(res.status).toBe(404);
    expect(res.headers.get('Content-Type')).toContain('application/json');
  });
  it('marks preview responses noindex and adds HSTS only in production', async () => {
    const preview = await handle(req('/'), env());
    expect(preview.headers.get('X-Robots-Tag')).toContain('noindex');
    expect(preview.headers.get('Strict-Transport-Security')).toBeNull();
    const prod = await handle(req('/'), env({ SITE_ENV: 'production' }));
    expect(prod.headers.get('X-Robots-Tag')).toBeNull();
    expect(prod.headers.get('Strict-Transport-Security')).toContain('max-age=31536000');
  });
  it('falls back to static assets for any other path', async () => {
    const res = await handle(req('/en'), env());
    expect(await res.text()).toBe('asset');
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });
});
