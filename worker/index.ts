/**
 * vision-plus-web — Cloudflare Worker with Static Assets (MASTER_PROJECT_PLAN §29, §42.2).
 * The Worker runs ONLY for the routes in `assets.run_worker_first` ("/" and "/api/*");
 * every other request is served directly from the static export in ./out (no Worker invocation).
 *
 * P3 scope: root locale negotiation + GET /api/contact/health. The contact pipeline is P6.
 */
import { baseSecurityHeaders, withHeaders, type SiteEnv } from './headers';
import { negotiateLocale } from './locale';

export interface Env extends SiteEnv {
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Optional build/version identifier surfaced by the health route. */
  BUILD_ID?: string;
}

const json = (env: Env, status: number, body: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...baseSecurityHeaders(env), ...extra },
  });

export function rootRedirect(request: Request, env: Env): Response {
  const url = new URL(request.url);
  const locale = negotiateLocale(request.headers.get('Cookie'), request.headers.get('Accept-Language'));
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/${locale}${url.search}`,
      Vary: 'Accept-Language, Cookie',
      'Cache-Control': 'private, no-store',
      ...baseSecurityHeaders(env),
    },
  });
}

export function health(request: Request, env: Env): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return json(env, 405, { status: 'error', code: 'method_not_allowed' }, { Allow: 'GET, HEAD' });
  }
  // No side effects, no secrets, no dependencies on later-phase integrations.
  return json(env, 200, { status: 'ok', service: 'vision-plus-web', environment: env.SITE_ENV ?? 'preview', build: env.BUILD_ID ?? null });
}

export async function handle(request: Request, env: Env): Promise<Response> {
  const { pathname } = new URL(request.url);
  if (pathname === '/') return rootRedirect(request, env);
  if (pathname === '/api/contact/health') return health(request, env);
  if (pathname.startsWith('/api/')) return json(env, 404, { status: 'error', code: 'not_found' });
  // Defensive: any other path routed here (should not happen with run_worker_first) → static assets.
  const res = await env.ASSETS.fetch(request);
  return withHeaders(res, baseSecurityHeaders(env));
}

const worker = {
  fetch(request: Request, env: Env): Promise<Response> {
    return handle(request, env);
  },
};

export default worker;
