import { describe, expect, it } from 'vitest';
import { copyStatus, getCatalog, getCompany, getHome, offices } from '@/content';
import { industries, partners, projects, solutions } from '@/content/data/registry';
import { locales } from '@/i18n/locales';

describe('content', () => {
  it('has copy for every registered solution and industry in every locale', () => {
    for (const l of locales) {
      const c = getCatalog(l);
      for (const s of solutions) expect(c.solutions[s.slug].name.length, `${l} ${s.slug}`).toBeGreaterThan(1);
      for (const i of industries) expect(c.industries[i.slug].summary.length, `${l} ${i.slug}`).toBeGreaterThan(5);
    }
  });

  it('keeps the approved English copy verbatim for key brand lines', () => {
    expect(getCompany('en').tagline).toEqual(['Connected by Technology.', 'Driven by Intelligence.']);
    expect(getHome('en').mobileNvr.title).toBe('Security That Moves With You.');
    expect(getCatalog('en').approach).toHaveLength(8);
    expect(getCompany('en').why.points).toHaveLength(8);
  });

  it('marks Arabic and Chinese as draft translations until the client supplies approved copy', () => {
    expect(copyStatus('en')).toBe('approved');
    expect(copyStatus('ar')).toBe('draft-mt');
    expect(copyStatus('zh')).toBe('draft-mt');
  });

  it('ships only the client-confirmed partners (A-30), no invented projects or office details', () => {
    // D-08 update 2026-10-03: exactly the 17 names the client confirmed, as supplied; no logo until the designer's files
    expect(partners.map((p) => p.name)).toEqual([
      'Hikvision',
      'UNV',
      'Dahua',
      'Axis',
      'Bosch',
      'ITC',
      'Hanwha',
      'ZKTeco',
      'Suprema',
      'HID',
      'Honeywell',
      'Johnson Controls',
      'Genetec',
      'Milestone',
      'Siemens',
      'Schneider Electric',
      'Philips',
    ]);
    for (const p of partners) {
      expect(p.status).toBe('confirmed');
      expect(p.logo, `${p.name}: logos come only from the designer's files`).toBeUndefined();
    }
    expect(new Set(partners.map((p) => p.slug)).size).toBe(partners.length);
    expect(projects).toHaveLength(0);
    for (const o of offices) {
      expect(o.address).toBeNull();
      expect(o.phone).toBeNull();
      expect(o.email).toBeNull();
    }
  });
});
