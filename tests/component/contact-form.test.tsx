// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ContactForm, type ContactFormLabels } from '@/components/sections/contact/contact-form';
import { CATEGORY_OPTIONS } from '@/features/contact/options';

// Component tests (MASTER_PROJECT_PLAN §40, P5-T2): inquiry form states. Labels are test strings; the real ones come
// from messages/<locale>.json (the E2E suite covers those in all three locales).
const labels: ContactFormLabels = {
  title: 'Inquiry',
  type: { label: 'Inquiry type', consultation: 'Consultation', product: 'Product', general: 'General', partnership: 'Partnership' },
  name: 'Name',
  company: 'Company',
  email: 'Email',
  phone: 'Phone',
  phoneHint: 'Phone hint',
  location: { label: 'Project location', qatar: 'Qatar', egypt: 'Egypt', other: 'Other' },
  industry: 'Industry',
  solution: 'Solution',
  category: 'Category',
  message: 'Message',
  messageHint: 'Message hint',
  consent: 'I agree',
  optional: 'optional',
  submit: 'Send',
  summary: Array.from({ length: 11 }, (_, i) => `${i + 1} problem(s)`),
  errors: {
    required: 'Required.',
    nameLength: 'Name length.',
    companyLength: 'Company length.',
    email: 'Email invalid.',
    phone: 'Phone invalid.',
    messageLength: 'Message length.',
    messageLinks: 'Too many links.',
    consent: 'Consent needed.',
  },
  notConnected: 'Not connected (preview).',
};
const options = (ids: string[]) => ids.map((value) => ({ value, label: value }));
const form = (search = '') => {
  window.history.replaceState(null, '', `/en/contact${search}`);
  return render(
    <ContactForm
      locale="en"
      labels={labels}
      industries={options(['retail', 'hospitality', 'other'])}
      solutions={options(['access-control', 'not-sure'])}
      categories={options([...CATEGORY_OPTIONS])}
    />,
  );
};
const field = (id: string) => document.getElementById(id) as HTMLInputElement;
const fillValid = () => {
  fireEvent.change(field('name'), { target: { value: 'Test Person' } });
  fireEvent.change(field('company'), { target: { value: 'Test Co' } });
  fireEvent.change(field('email'), { target: { value: 'person@example.com' } });
  fireEvent.change(field('location'), { target: { value: 'qatar' } });
  fireEvent.change(field('message'), { target: { value: 'We need a quote for our site.' } });
  fireEvent.click(field('consent'));
};

afterEach(cleanup);

describe('inquiry type', () => {
  it('shows the selects each type needs and marks company optional where it is', () => {
    form();
    const shown = () => ['industry', 'solution', 'category'].filter((id) => field(id));
    expect(shown()).toEqual(['industry', 'solution']);
    expect(within(field('company').closest('.field')!).queryByText('(optional)')).toBeNull();
    fireEvent.click(screen.getByLabelText('Product'));
    expect(shown()).toEqual(['category']);
    expect(within(field('company').closest('.field')!).getByText('(optional)')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Partnership'));
    expect(shown()).toEqual([]);
    expect(field('company').required).toBe(true);
  });

  it('pre-fills allowed values from the query and ignores anything else', () => {
    form(`?type=product&category=${CATEGORY_OPTIONS[0]}`);
    expect((screen.getByLabelText('Product') as HTMLInputElement).checked).toBe(true);
    expect((field('category') as unknown as HTMLSelectElement).value).toBe(CATEGORY_OPTIONS[0]);
    cleanup();
    form('?type=bogus&industry=nowhere');
    expect((screen.getByLabelText('Consultation') as HTMLInputElement).checked).toBe(true);
    expect((field('industry') as unknown as HTMLSelectElement).value).toBe('');
  });
});

describe('validation', () => {
  it('validates a field on blur and only the fields already visited', async () => {
    form();
    fireEvent.focus(field('name'));
    fireEvent.blur(field('name'));
    await screen.findByText('Required.');
    expect(field('name').getAttribute('aria-invalid')).toBe('true');
    expect(field('name').getAttribute('aria-describedby')).toBe('name-error');
    expect(field('email').getAttribute('aria-invalid')).toBeNull();
    fireEvent.change(field('name'), { target: { value: 'Test Person' } });
    fireEvent.blur(field('name'));
    await waitFor(() => expect(field('name').getAttribute('aria-invalid')).toBeNull());
  });

  it('submit with errors shows a summary in page order linking to each field, and focuses the first', async () => {
    form();
    fireEvent.change(field('email'), { target: { value: 'not-an-email' } });
    fireEvent.submit(field('name').form!);
    const summary = await screen.findByRole('alert');
    const links = within(summary).getAllByRole('link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['#name', '#company', '#email', '#location', '#message', '#consent']);
    expect(within(summary).getByText('6 problem(s)')).toBeTruthy();
    expect(links[2]!.textContent).toContain('Email invalid.');
    await waitFor(() => expect(document.activeElement).toBe(field('name')));
  });

  it('pressing submit does not re-validate on the blur it causes (so the button does not move under the pointer)', async () => {
    form();
    fireEvent.focus(field('name'));
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Send' }));
    fireEvent.blur(field('name'));
    await new Promise((r) => setTimeout(r, 50));
    expect(field('name').getAttribute('aria-invalid')).toBeNull();
  });

  it('a valid submit sends nothing yet and says so (preview, Phase 6), with no summary', async () => {
    form();
    fillValid();
    fireEvent.submit(field('name').form!);
    await screen.findByText('Not connected (preview).');
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('status').textContent).toBe('Not connected (preview).');
  });
});
