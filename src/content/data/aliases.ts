/**
 * Sitemap alias → canonical route (MASTER_PROJECT_PLAN §9.2, §11). The data is JSON so that
 * scripts/postbuild.mjs can emit the 301s in out/_redirects without a TypeScript step.
 */
import data from './aliases.json';

export interface Alias {
  /** Locale-less path from the client's sitemap naming, e.g. "/solutions/video-surveillance". */
  from: string;
  /** Locale-less canonical target; may carry an anchor or a UX query string. */
  to: string;
  /** The sitemap label it comes from (02 p6). */
  sitemap: string;
}

export const aliases: Alias[] = data.aliases;
export const pendingAliases: { from: string; reason: string }[] = data._meta.pending;
