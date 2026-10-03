'use client';

import { useRef, useState, useSyncExternalStore, type FocusEvent, type FormEvent, type ReactNode } from 'react';
import {
  FIELDS_BY_TYPE,
  COMPANY_REQUIRED,
  INQUIRY_TYPES,
  PROJECT_LOCATIONS,
  prefillFromQuery,
  type ErrorCode,
  type InquiryField,
  type InquiryType,
} from '@/features/contact/options';

// The Zod schema loads on demand (first focus of the form), outside the page's initial JavaScript budget.
let schemaModule: Promise<typeof import('@/features/contact/schema')> | null = null;
const loadSchema = () => (schemaModule ??= import('@/features/contact/schema'));
const validate = async (raw: Record<string, unknown>) => (await loadSchema()).validateInquiry(raw);

export interface ContactFormLabels {
  title: string;
  type: { label: string } & Record<InquiryType, string>;
  name: string;
  company: string;
  email: string;
  phone: string;
  phoneHint: string;
  location: { label: string } & Record<(typeof PROJECT_LOCATIONS)[number], string>;
  industry: string;
  solution: string;
  category: string;
  message: string;
  messageHint: string;
  consent: ReactNode;
  optional: string;
  submit: string;
  /** Pre-formatted per count: summary[n - 1] for n errors. */
  summary: string[];
  errors: Record<ErrorCode, string>;
  /** Preview-only status after a valid submit while sending is not connected (P6). */
  notConnected?: string;
}

interface Option {
  value: string;
  label: string;
}

const noop = () => () => {};
const readSearch = () => window.location.search;
const serverSearch = () => '';

/**
 * Inquiry form UI (MASTER_PROJECT_PLAN §30.1–§30.2, §30.4; P5A-10 notes §55.3.13). Fields follow the inquiry type,
 * pre-fill from the query string, and validate on blur and on submit with the shared schema; on submit with errors an
 * error summary (role=alert) links to each field and focus moves to the first invalid one. The shared Zod schema is
 * fetched when the form is first focused. Sending is Phase 6: a valid
 * submit sends nothing (preview builds say so). The server render matches the first client render (no query read).
 */
export function ContactForm({
  locale,
  labels,
  industries,
  solutions,
  categories,
}: {
  locale: string;
  labels: ContactFormLabels;
  industries: Option[];
  solutions: Option[];
  categories: Option[];
}) {
  const search = useSyncExternalStore(noop, readSearch, serverSearch);
  const prefill = prefillFromQuery(search);
  const [chosenType, setChosenType] = useState<InquiryType | null>(null);
  const type = chosenType ?? prefill.type ?? 'consultation';
  const [errors, setErrors] = useState<Partial<Record<InquiryField, ErrorCode>>>({});
  const [touched, setTouched] = useState<Set<InquiryField>>(new Set());
  // the summary is a snapshot of the last submit: it must not change on blur, or the layout would shift under the
  // pointer between pressing and releasing the submit button
  const [summary, setSummary] = useState<Partial<Record<InquiryField, ErrorCode>>>({});
  const [status, setStatus] = useState<'idle' | 'notConnected'>('idle');
  const form = useRef<HTMLFormElement>(null);
  // set while the submit button is being pressed: the blur this causes must not re-validate (an error appearing or
  // disappearing would move the button under the pointer and swallow the click); onSubmit validates everything
  const submitting = useRef(false);
  const shown = FIELDS_BY_TYPE[type];
  const companyRequired = COMPANY_REQUIRED.includes(type);

  const values = () => {
    const data = new FormData(form.current!);
    const v: Record<string, unknown> = Object.fromEntries([...data.entries()].filter(([k]) => k !== 'company_website' && k !== 'locale'));
    v.consent = data.get('consent') === 'on';
    for (const k of ['industry', 'solution', 'category']) if (v[k] === '') delete v[k];
    return v;
  };

  const onBlur = async (e: FocusEvent<HTMLFormElement>) => {
    if (submitting.current || (e.relatedTarget as HTMLElement | null)?.getAttribute('type') === 'submit') return;
    const name = (e.target as unknown as HTMLInputElement).name as InquiryField;
    if (!name || name === ('company_website' as InquiryField)) return;
    const next = new Set(touched).add(name);
    setTouched(next);
    const all = await validate(values());
    setErrors(Object.fromEntries(Object.entries(all).filter(([f]) => next.has(f as InquiryField))));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitting.current = false;
    const all = await validate(values());
    const fields = Object.keys(all) as InquiryField[];
    setErrors(all);
    setTouched(new Set(fields));
    setSummary(all);
    if (fields.length) {
      setStatus('idle');
      const first = form.current?.querySelector<HTMLElement>(`[name="${fields[0]}"]`);
      first?.focus();
      return;
    }
    // Phase 6 connects sending (Worker, anti-spam, Sheet, email); until then nothing is sent and no success is faked.
    setStatus('notConnected');
  };

  const describedBy = (field: InquiryField, hint?: boolean) =>
    [hint && `${field}-hint`, errors[field] && `${field}-error`].filter(Boolean).join(' ') || undefined;
  const error = (field: InquiryField) =>
    errors[field] ? (
      <p id={`${field}-error`} className="field__error">
        {labels.errors[errors[field]!]}
      </p>
    ) : null;
  const optional = <span className="field__optional">({labels.optional})</span>;
  const fieldLabel = (f: InquiryField): ReactNode =>
    ({
      type: labels.type.label,
      name: labels.name,
      company: labels.company,
      email: labels.email,
      phone: labels.phone,
      location: labels.location.label,
      industry: labels.industry,
      solution: labels.solution,
      category: labels.category,
      message: labels.message,
      consent: null, // no approved short label: the consent error text says what to do
    })[f];
  const select = (field: 'industry' | 'solution' | 'category', label: string, options: Option[], initial?: string) => (
    <div className="field">
      <label className="field__label" htmlFor={field}>
        {label} {optional}
      </label>
      {/* keyed on the pre-fill so a query value becomes the initial selection after hydration */}
      <select key={`${field}-${initial ?? ''}`} id={field} name={field} className="select" defaultValue={initial ?? ''} aria-describedby={describedBy(field)}>
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error(field)}
    </div>
  );

  return (
    <form ref={form} className="contact-form" noValidate onSubmit={onSubmit} onBlur={onBlur} onFocus={() => void loadSchema()} aria-labelledby="inquiry-title">
      {Object.keys(summary).length > 0 && (
        <div className="form-summary" role="alert">
          <p className="form-summary__title">{labels.summary[Math.min(Object.keys(summary).length, labels.summary.length) - 1]}</p>
          <ul>
            {(Object.keys(summary) as InquiryField[]).map((f) => (
              <li key={f}>
                <a href={`#${f === 'type' ? `type-${INQUIRY_TYPES[0]}` : f}`}>
                  {fieldLabel(f) && <span className="form-summary__field">{fieldLabel(f)}</span>} {labels.errors[summary[f]!]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <input type="hidden" name="locale" value={locale} />
      {/* honeypot (§30.5 layer 1): hidden from people and assistive technology, filled only by bots */}
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="company_website">Website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="field">
        <legend className="field__label">{labels.type.label}</legend>
        <div className="segmented">
          {INQUIRY_TYPES.map((t) => (
            <label key={t}>
              <input
                type="radio"
                id={`type-${t}`}
                name="type"
                value={t}
                checked={type === t}
                onChange={() => {
                  setChosenType(t);
                  setStatus('idle');
                }}
              />
              {labels.type[t]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label className="field__label" htmlFor="name">
          {labels.name}
        </label>
        <input
          id="name"
          name="name"
          className="input"
          autoComplete="name"
          required
          aria-invalid={!!errors.name || undefined}
          aria-describedby={describedBy('name')}
        />
        {error('name')}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="company">
          {labels.company} {!companyRequired && optional}
        </label>
        <input
          id="company"
          name="company"
          className="input"
          autoComplete="organization"
          required={companyRequired}
          aria-invalid={!!errors.company || undefined}
          aria-describedby={describedBy('company')}
        />
        {error('company')}
      </div>

      <div className="contact-form__row">
        <div className="field">
          <label className="field__label" htmlFor="email">
            {labels.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            className="input"
            autoComplete="email"
            required
            aria-invalid={!!errors.email || undefined}
            aria-describedby={describedBy('email')}
          />
          {error('email')}
        </div>
        <div className="field">
          <label className="field__label" htmlFor="phone">
            {labels.phone} {optional}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            dir="ltr"
            className="input"
            autoComplete="tel"
            aria-invalid={!!errors.phone || undefined}
            aria-describedby={describedBy('phone', true)}
          />
          <p id="phone-hint" className="field__hint">
            {labels.phoneHint}
          </p>
          {error('phone')}
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="location">
          {labels.location.label}
        </label>
        <select
          id="location"
          name="location"
          className="select"
          required
          defaultValue=""
          aria-invalid={!!errors.location || undefined}
          aria-describedby={describedBy('location')}
        >
          <option value="" disabled>
            —
          </option>
          {PROJECT_LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {labels.location[l]}
            </option>
          ))}
        </select>
        {error('location')}
      </div>

      {shown.includes('industry') && select('industry', labels.industry, industries, prefill.industry)}
      {shown.includes('solution') && select('solution', labels.solution, solutions, prefill.solution)}
      {shown.includes('category') && select('category', labels.category, categories, prefill.category)}

      <div className="field">
        <label className="field__label" htmlFor="message">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          className="textarea"
          required
          maxLength={3000}
          aria-invalid={!!errors.message || undefined}
          aria-describedby={describedBy('message', true)}
        />
        <p id="message-hint" className="field__hint">
          {labels.messageHint}
        </p>
        {error('message')}
      </div>

      <div className="field">
        <label className="check" htmlFor="consent">
          <input id="consent" name="consent" type="checkbox" required aria-invalid={!!errors.consent || undefined} aria-describedby={describedBy('consent')} />
          <span>{labels.consent}</span>
        </label>
        {error('consent')}
      </div>

      <div className="contact-form__actions">
        <button
          type="submit"
          className="btn btn--primary"
          onPointerDown={() => {
            submitting.current = true;
            window.setTimeout(() => (submitting.current = false), 1000);
          }}
        >
          {labels.submit}
        </button>
        <p className="contact-form__status" role="status" aria-live="polite">
          {status === 'notConnected' && labels.notConnected}
        </p>
      </div>
    </form>
  );
}
