import { industries, productCategories, solutions } from '@/content/data/registry';

/**
 * Inquiry form options and types (MASTER_PROJECT_PLAN §30.1; P5A-10 notes §55.3.13): the allowed values, which fields
 * each inquiry type shows, and the query-string pre-fill. Free of Zod, so the Contact page can load it up front; the
 * validation schema (schema.ts) loads on demand.
 */
export const INQUIRY_TYPES = ['consultation', 'product', 'general', 'partnership'] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];
export const PROJECT_LOCATIONS = ['qatar', 'egypt', 'other'] as const;
export const INDUSTRY_OPTIONS = [...industries.map((i) => i.slug), 'other'] as const;
export const SOLUTION_OPTIONS = [...solutions.map((s) => s.slug), 'services', 'not-sure'] as const;
export const CATEGORY_OPTIONS = productCategories;

/** Which optional selects each inquiry type shows (§30.1 "Shown when"). */
export const FIELDS_BY_TYPE: Record<InquiryType, ('industry' | 'solution' | 'category')[]> = {
  consultation: ['industry', 'solution'],
  product: ['category'],
  general: ['solution'],
  partnership: [],
};
/** Company / organization is required for these types and optional otherwise. */
export const COMPANY_REQUIRED: readonly InquiryType[] = ['consultation', 'partnership'];

export type ErrorCode = 'required' | 'nameLength' | 'companyLength' | 'email' | 'phone' | 'messageLength' | 'messageLinks' | 'consent';

export type InquiryField = 'type' | 'name' | 'company' | 'email' | 'phone' | 'location' | 'industry' | 'solution' | 'category' | 'message' | 'consent';
/** Field order on the page: the error summary lists and focuses errors in this order. */
export const FIELD_ORDER: InquiryField[] = ['type', 'name', 'company', 'email', 'phone', 'location', 'industry', 'solution', 'category', 'message', 'consent'];

/** Pre-fill from query parameters (§30.1): only allowed values are taken; anything else is ignored. */
export function prefillFromQuery(search: string): { type?: InquiryType; industry?: string; solution?: string; category?: string } {
  const q = new URLSearchParams(search);
  const pick = <T extends readonly string[]>(key: string, values: T) => {
    const v = q.get(key);
    return v && (values as readonly string[]).includes(v) ? v : undefined;
  };
  return {
    type: pick('type', INQUIRY_TYPES) as InquiryType | undefined,
    industry: pick('industry', INDUSTRY_OPTIONS),
    solution: pick('solution', SOLUTION_OPTIONS),
    category: pick('category', CATEGORY_OPTIONS),
  };
}
