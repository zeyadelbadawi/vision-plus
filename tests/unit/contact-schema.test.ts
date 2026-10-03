import { describe, expect, it } from 'vitest';
import { FIELDS_BY_TYPE, prefillFromQuery } from '@/features/contact/options';
import { validateInquiry } from '@/features/contact/schema';

// P5A-10 (MASTER_PROJECT_PLAN §30.1–§30.3): one schema for the browser and the P6 Worker; issues are message codes.
const valid = {
  type: 'general',
  name: 'Test Person',
  company: '',
  email: 'Test@Example.com',
  phone: '',
  location: 'qatar',
  message: 'We need a site survey.',
  consent: true,
};

describe('inquiry schema', () => {
  it('accepts a complete general inquiry without company or phone', () => {
    expect(validateInquiry(valid)).toEqual({});
  });

  it('reports a missing company together with the other errors, not one submit later', () => {
    const errors = validateInquiry({ type: 'consultation', name: '', email: '', message: '', consent: false });
    expect(Object.keys(errors)).toEqual(['name', 'company', 'email', 'location', 'message', 'consent']);
  });

  it('requires company only for consultation and partnership', () => {
    for (const type of ['consultation', 'partnership']) expect(validateInquiry({ ...valid, type })).toEqual({ company: 'required' });
    for (const type of ['product', 'general']) expect(validateInquiry({ ...valid, type })).toEqual({});
  });

  it('returns the §30.1 codes, one per field, in page order', () => {
    const errors = validateInquiry({ type: 'general', name: 'A', email: 'nope', phone: '12', message: 'short', consent: false });
    expect(Object.entries(errors)).toEqual([
      ['name', 'nameLength'],
      ['email', 'email'],
      ['phone', 'phone'],
      ['location', 'required'],
      ['message', 'messageLength'],
      ['consent', 'consent'],
    ]);
    expect(validateInquiry({ ...valid, name: '', email: '', message: '' })).toEqual({ name: 'required', email: 'required', message: 'required' });
  });

  it('applies the phone, length and link rules', () => {
    expect(validateInquiry({ ...valid, phone: '+974 4400-1234' })).toEqual({});
    expect(validateInquiry({ ...valid, phone: '4400 12a4' })).toEqual({ phone: 'phone' });
    expect(validateInquiry({ ...valid, name: 'x'.repeat(101) })).toEqual({ name: 'nameLength' });
    expect(validateInquiry({ ...valid, company: 'x'.repeat(121) })).toEqual({ company: 'companyLength' });
    const links = 'see https://a.example https://b.example www.c.example http://d.example please';
    expect(validateInquiry({ ...valid, message: links })).toEqual({ message: 'messageLinks' });
  });

  it('rejects values outside the allowed lists', () => {
    expect(validateInquiry({ ...valid, location: 'mars' })).toEqual({ location: 'required' });
    expect(validateInquiry({ ...valid, solution: 'teleportation' })).toEqual({ solution: 'required' });
    expect(validateInquiry({ ...valid, solution: 'not-sure', industry: 'other' })).toEqual({});
  });

  it('shows the optional selects by inquiry type', () => {
    expect(FIELDS_BY_TYPE).toEqual({ consultation: ['industry', 'solution'], product: ['category'], general: ['solution'], partnership: [] });
  });

  it('pre-fills only allowed query values', () => {
    expect(prefillFromQuery('?type=consultation&solution=access-control&industry=banking-finance')).toEqual({
      type: 'consultation',
      solution: 'access-control',
      industry: 'banking-finance',
      category: undefined,
    });
    expect(prefillFromQuery('?type=spam&solution=<script>&category=video-intercom')).toEqual({
      type: undefined,
      solution: undefined,
      industry: undefined,
      category: 'video-intercom',
    });
  });
});
