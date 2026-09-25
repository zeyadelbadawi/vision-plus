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

  it('never ships invented partners, projects or office details', () => {
    expect(partners).toHaveLength(0);
    expect(projects).toHaveLength(0);
    for (const o of offices) {
      expect(o.address).toBeNull();
      expect(o.phone).toBeNull();
      expect(o.email).toBeNull();
    }
  });
});
