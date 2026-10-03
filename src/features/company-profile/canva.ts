/**
 * Canva embed parser (MASTER_PROJECT_PLAN §33; P5A-11 notes §55.3.14). The client pastes Canva's "Embed" HTML; only
 * the iframe `src` and the aspect ratio are extracted and validated: https, host www.canva.com or www.canva.cn, path
 * /design/<id>/…/view and the `embed` parameter. Raw HTML is never stored or injected anywhere.
 */
export interface CanvaEmbed {
  src: string;
  /** CSS aspect-ratio value, e.g. "16 / 9". */
  aspectRatio: string;
}

const HOSTS = new Set(['www.canva.com', 'www.canva.cn']);

export function parseCanvaEmbed(html: string): CanvaEmbed {
  const src = /<iframe\b[^>]*\ssrc\s*=\s*["']([^"']+)["']/i.exec(html)?.[1];
  if (!src) throw new Error('No <iframe src="…"> found in the pasted embed code.');
  let url: URL;
  try {
    url = new URL(src.replace(/&amp;/g, '&'));
  } catch {
    throw new Error(`The iframe src is not a valid URL: ${src}`);
  }
  if (url.protocol !== 'https:') throw new Error('The embed URL must use https.');
  if (!HOSTS.has(url.hostname)) throw new Error(`The embed host must be www.canva.com or www.canva.cn, not ${url.hostname}.`);
  if (!/^\/design\/[A-Za-z0-9_-]+\/(?:[A-Za-z0-9_-]+\/)?view\/?$/.test(url.pathname))
    throw new Error(`The embed path must be /design/<id>/…/view, not ${url.pathname}.`);
  if (!url.searchParams.has('embed')) throw new Error('The embed URL must carry the "embed" parameter (Canva → Share → Embed).');

  // Canva wraps the iframe in a box whose padding-top sets the ratio (56.25 % → 16:9); default 16:9.
  const padding = /padding-top\s*:\s*([\d.]+)%/i.exec(html)?.[1];
  const ratio = padding ? Number(padding) / 100 : 9 / 16;
  const aspectRatio = Math.abs(ratio - 9 / 16) < 0.002 ? '16 / 9' : `10000 / ${Math.round(ratio * 10000)}`;
  return { src: `${url.origin}${url.pathname}${url.search}`, aspectRatio };
}
