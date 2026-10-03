import * as z from 'zod/mini';
import {
  CATEGORY_OPTIONS,
  COMPANY_REQUIRED,
  FIELD_ORDER,
  INDUSTRY_OPTIONS,
  INQUIRY_TYPES,
  PROJECT_LOCATIONS,
  SOLUTION_OPTIONS,
  type ErrorCode,
  type InquiryField,
  type InquiryType,
} from './options';

/**
 * Inquiry form schema (MASTER_PROJECT_PLAN §30.1–§30.3; P5A-10 notes §55.3.13). One schema for the browser (P5A-10)
 * and the Worker (P6), so both enforce the same rules. Issues carry message *codes*: each is a key under
 * `form.errors` in messages/{locale}.json, never prose (§30.4). Written with `zod/mini` and loaded by the page on
 * demand (when the form is first focused), so it is not part of the Contact page's initial JavaScript budget.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^(?=.{7,20}$)\+?[0-9][0-9 -]*[0-9]$/;
const urlCount = (s: string) => (s.match(/\bhttps?:\/\/|\bwww\./gi) ?? []).length;
const oneOf = <T extends readonly string[]>(values: T) =>
  z.optional(z.string().check(z.refine((v) => !v || (values as readonly string[]).includes(v), { error: 'required' })));

export const inquirySchema = z
  .object({
    type: z.enum(INQUIRY_TYPES, { error: 'required' }),
    name: z.string().check(z.trim(), z.minLength(1, { error: 'required' }), z.minLength(2, { error: 'nameLength' }), z.maxLength(100, { error: 'nameLength' })),
    company: z._default(z.string().check(z.trim(), z.maxLength(120, { error: 'companyLength' })), ''),
    email: z
      .string()
      .check(z.trim(), z.toLowerCase(), z.minLength(1, { error: 'required' }), z.maxLength(254, { error: 'email' }), z.regex(EMAIL, { error: 'email' })),
    phone: z._default(
      z.string().check(
        z.trim(),
        z.refine((v) => v === '' || PHONE.test(v), { error: 'phone' }),
      ),
      '',
    ),
    location: z.enum(PROJECT_LOCATIONS, { error: 'required' }),
    industry: oneOf(INDUSTRY_OPTIONS),
    solution: oneOf(SOLUTION_OPTIONS),
    category: oneOf(CATEGORY_OPTIONS),
    message: z.string().check(
      z.trim(),
      z.minLength(1, { error: 'required' }),
      z.minLength(10, { error: 'messageLength' }),
      z.maxLength(3000, { error: 'messageLength' }),
      z.refine((v) => urlCount(v) <= 3, { error: 'messageLinks' }),
    ),
    consent: z.literal(true, { error: 'consent' }),
  })
  .check(z.refine((v) => !(COMPANY_REQUIRED.includes(v.type) && !v.company), { error: 'required', path: ['company'] }));

/** Validates raw form values; returns the first error code per field (in page order), or an empty object. */
export function validateInquiry(raw: Record<string, unknown>): Partial<Record<InquiryField, ErrorCode>> {
  const result = inquirySchema.safeParse(raw);
  if (result.success) return {};
  const errors: Partial<Record<InquiryField, ErrorCode>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as InquiryField;
    if (field && !errors[field]) errors[field] = issue.message as ErrorCode;
  }
  // Zod runs object-level refinements only once every field is valid, so the type-dependent company rule would show
  // up one submit late; report it with the other errors.
  const type = raw.type as InquiryType;
  const company = typeof raw.company === 'string' ? raw.company.trim() : '';
  if (!errors.company && COMPANY_REQUIRED.includes(type) && !company) errors.company = 'required';
  return Object.fromEntries(FIELD_ORDER.filter((f) => errors[f]).map((f) => [f, errors[f]]));
}
