// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { PartnerMarquee } from '@/components/sections/home/partner-marquee';

// Component tests (MASTER_PROJECT_PLAN §40, P5-T2): the marquee's visible pause control (WCAG 2.2.2).
afterEach(cleanup);

describe('PartnerMarquee', () => {
  const marquee = () =>
    render(
      <PartnerMarquee pauseLabel="Pause" playLabel="Play">
        <span>Partner A</span>
      </PartnerMarquee>,
    );

  it('announces the partners once: the duplicate row is hidden and inert', () => {
    marquee();
    const groups = document.querySelectorAll('.marquee__group');
    expect(groups).toHaveLength(2);
    expect(groups[0]!.getAttribute('aria-hidden')).toBeNull();
    expect(groups[1]!.getAttribute('aria-hidden')).toBe('true');
    expect(groups[1]!.hasAttribute('inert')).toBe(true);
  });

  it('the toggle pauses and resumes, with aria-pressed and a matching label', () => {
    const { container } = marquee();
    const root = container.querySelector('.marquee') as HTMLElement;
    const pause = screen.getByRole('button', { name: 'Pause' });
    expect(pause.getAttribute('aria-pressed')).toBe('false');
    expect(root.dataset.paused).toBeUndefined();
    fireEvent.click(pause);
    const play = screen.getByRole('button', { name: 'Play' });
    expect(play.getAttribute('aria-pressed')).toBe('true');
    expect(root.dataset.paused).toBe('true');
    fireEvent.click(play);
    expect(root.dataset.paused).toBeUndefined();
  });
});
