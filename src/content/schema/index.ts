/**
 * Zod schemas for every content file (MASTER_PROJECT_PLAN §12.1, §40 "content:check: Zod over all locale
 * JSON and data"). TypeScript `satisfies` (src/content/index.ts) already enforces key parity at compile
 * time; these schemas add what types cannot: exact key sets per registry, non-empty trimmed text, valid
 * status metadata, SEO length budgets, and the shape of data files. Run by scripts/content-check.mjs.
 * Self-contained (only imports zod) so Node can load it directly.
 */
import { z } from 'zod';

export const STATUSES = ['approved', 'derived', 'draft', 'placeholder', 'draft-mt'] as const;

/** Visible text: non-empty, no leading/trailing whitespace, no doubled spaces. */
export const text = z
  .string()
  .min(1)
  .refine((s) => s === s.trim(), 'has leading/trailing whitespace')
  .refine((s) => !/ {2}/.test(s), 'contains a doubled space');

export const meta = z.object({
  status: z.enum(STATUSES),
  source: z.string().optional(),
  note: z.string().optional(),
  review: z.record(z.string(), z.object({ status: z.enum(['derived', 'draft', 'placeholder']), source: z.string().min(3) })).optional(),
});

/** Object with exactly these keys, each matching `value`. */
const keyed = <T extends z.ZodTypeAny>(keys: readonly string[], value: T) =>
  z.strictObject(Object.fromEntries(keys.map((k) => [k, value])) as Record<string, T>);

export interface Registries {
  solutions: readonly string[];
  services: readonly string[];
  industries: readonly string[];
  productCategories: readonly string[];
}

export function schemas(r: Registries) {
  const item = z.strictObject({ key: z.string().regex(/^[a-z-]+$/), title: text, text });
  const capabilities = z.strictObject({ intro: text, items: z.array(text).min(3) });
  const solutionItem = z.strictObject({
    headline: text,
    body: z.array(text).min(1),
    capabilities: capabilities.optional(),
    closing: text.optional(),
    closingLead: text.optional(),
    values: z.array(text).length(5).optional(),
    principles: z.strictObject({ intro: text, items: z.array(item).length(4) }).optional(),
    fleet: z
      .strictObject({
        eyebrow: text,
        title: text,
        body: z.array(text).length(3),
        pillars: z.array(item).length(6),
        applicationsTitle: text,
        applications: z.array(text).length(9),
        equation: z.array(text).length(5),
      })
      .optional(),
  });
  const seoEntry = z.strictObject({ title: text.max(45), description: text.max(155) });

  return {
    'catalog.json': z.strictObject({
      _meta: meta,
      solutions: keyed(r.solutions, z.strictObject({ name: text, summary: text })),
      services: keyed(r.services, z.strictObject({ name: text })),
      approach: z.array(z.strictObject({ title: text, text })).length(8),
      industries: keyed(r.industries, z.strictObject({ name: text, summary: text })),
      productCategories: keyed(r.productCategories, z.strictObject({ name: text })),
    }),
    'solutions.json': z.strictObject({
      _meta: meta,
      hub: z.strictObject({ eyebrow: text, title: text, lede: text, integrationStatement: text }),
      items: keyed(r.solutions, solutionItem),
    }),
    'services.json': z.strictObject({
      _meta: meta,
      hero: z.strictObject({ eyebrow: text, title: text, lede: text }),
      items: keyed(r.services, z.strictObject({ body: z.array(text).min(1) })),
      approach: z.strictObject({ eyebrow: text, title: text, closing: text }),
    }),
    'seo.json': z.strictObject({
      _meta: meta,
      solutionsHub: seoEntry,
      solutions: keyed(r.solutions, seoEntry),
      industries: seoEntry,
      services: seoEntry,
      products: seoEntry,
      projects: seoEntry,
      about: seoEntry,
      partners: seoEntry,
      companyProfile: seoEntry,
      contact: seoEntry,
      privacy: seoEntry,
      notFound: seoEntry,
    }),
  } as Record<string, z.ZodTypeAny>;
}

/** Any copy file: metadata plus a tree whose leaves are visible text (empty strings allowed only for optional fields like a blank "where"). */
export const copyFile = z.looseObject({ _meta: meta });

const nullableUrl = z.url().nullable();
export const locations = z.strictObject({
  _meta: meta,
  offices: z
    .array(
      z.strictObject({
        key: z.enum(['qatar', 'egypt']),
        address: text.nullable(),
        phone: z
          .string()
          .regex(/^\+[\d\s-]{7,20}$/)
          .nullable(),
        email: z.email().nullable(),
        mapUrl: nullableUrl,
        mapEmbedSrc: nullableUrl,
      }),
    )
    .length(2),
});

export const aliases = z.strictObject({
  _meta: z.strictObject({
    status: z.enum(STATUSES),
    source: z.string(),
    pending: z.array(z.strictObject({ from: z.string().startsWith('/'), reason: z.string().min(3) })),
  }),
  aliases: z.array(z.strictObject({ from: z.string().regex(/^\/[a-z0-9/-]+$/), to: z.string().regex(/^\/[a-z0-9/-]*([?#][a-z0-9=&-]+)?$/), sitemap: text })),
});

/** Final image entries (images.json `assets`). */
export const finalImages = z.record(
  z.string().regex(/^[A-Z0-9-]+$/),
  z.looseObject({
    status: z.literal('final'),
    alt: z.strictObject({ en: text, ar: text, zh: text }),
    focal: z.strictObject({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).optional(),
  }),
);
