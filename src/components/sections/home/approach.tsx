import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getHome } from '@/content';
import { Section, SectionHeading } from '@/components/layout/section';
import { LinkButton } from '@/components/ui/button';
import { ArrowEnd } from '@/components/ui/icons';

/**
 * Approach (§26.1 #5). A real sequence → numbered. The gold lifecycle line is scrubbed by scroll:
 * each step's segment fills in order and its node activates when the line reaches it.
 */
export async function HomeApproach({ locale }: { locale: Locale }) {
  const { approach } = getHome(locale);
  const steps = getCatalog(locale).approach;
  const [tc, ta] = await Promise.all([
    getTranslations({ locale, namespace: 'cta' }),
    getTranslations({ locale, namespace: 'a11y' }),
  ]);
  return (
    <Section tone="canvas" labelledBy="approach-title">
      <div className="container-vp">
        <SectionHeading id="approach-title" title={approach.title} />
        <ol className="lifecycle mt-14 lg:mt-20" aria-label={ta('approachProgress')} data-progress="track" style={{ '--n': steps.length } as React.CSSProperties}>
          {steps.map((s, i) => (
            <li key={s.title} className="lifecycle__step" style={{ '--i': i } as React.CSSProperties}>
              <span className="lifecycle__line" aria-hidden="true">
                <span className="lifecycle__fill" />
              </span>
              <span className="lifecycle__node" aria-hidden="true" />
              <span className="lifecycle__n t-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="t-h3 lifecycle__title">{s.title}</h3>
              <p className="t-body-sm text-fg-muted">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 flex flex-col gap-8 border-t border-line pt-10 md:flex-row md:items-end md:justify-between lg:mt-20">
          <p className="t-h2 max-w-[24ch]">{approach.closing}</p>
          <LinkButton href="/services#approach" variant="text">
            {tc('approach')}
            <ArrowEnd size={16} />
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
