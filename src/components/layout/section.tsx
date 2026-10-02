import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'canvas' | 'raised' | 'dark';

/** Section surface + vertical rhythm (§20.3). `dark` opens a charcoal chapter (§18). */
export function Section({
  id,
  labelledBy,
  tone = 'canvas',
  className,
  children,
  spacing = 'default',
}: {
  id?: string;
  labelledBy?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
  spacing?: 'default' | 'sm' | 'lg' | 'none';
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'relative',
        tone === 'dark' && 'theme-dark bg-bg text-fg',
        tone === 'canvas' && 'bg-bg',
        tone === 'raised' && 'bg-bg-raised',
        spacing === 'default' && 'section-y',
        spacing === 'sm' && 'section-y-sm',
        spacing === 'lg' && 'section-y-lg',
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Section heading (§20.10): optional gold chapter seam, H2 (approved headline), optional lede.
 * No eyebrow labels. The seam draws once when the heading enters view.
 */
export function SectionHeading({
  id,
  title,
  lede,
  seam = true,
  size = 'h2',
  className,
}: {
  id: string;
  title: string;
  lede?: string;
  seam?: boolean;
  size?: 'h2' | 'h1' | 'display';
  className?: string;
}) {
  return (
    <div className={cn('max-w-[52rem]', className)} data-reveal="">
      {seam && <span className="seam mb-6 w-12" aria-hidden="true" />}
      <h2 id={id} className={size === 'display' ? 't-display' : size === 'h1' ? 't-h1' : 't-h2'}>
        {title}
      </h2>
      {lede && <p className="t-lede mt-5 max-w-[40rem] text-fg-muted">{lede}</p>}
    </div>
  );
}
