import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCompany } from '@/content';
import { Section } from '@/components/layout/section';
import { LinkButton } from '@/components/ui/button';
import { ArrowEnd } from '@/components/ui/icons';

/** Why Vision Plus (§26.1 #7) — editorial list with hairlines; not cards, not numbered (not a sequence). */
export async function HomeWhy({ locale }: { locale: Locale }) {
  const { why } = getCompany(locale);
  const tc = await getTranslations({ locale, namespace: 'cta' });
  return (
    <Section tone="canvas" labelledBy="why-title">
      <div className="container-vp grid-vp gap-y-12">
        <div className="col-span-4 md:col-span-8 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]" data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <h2 id="why-title" className="t-h1 max-w-[12ch]">
              {why.title}
            </h2>
            <div className="mt-8">
              <LinkButton href="/about#why-vision-plus" variant="text">
                {tc('ourStory')}
                <ArrowEnd size={16} />
              </LinkButton>
            </div>
          </div>
        </div>
        <ul className="col-span-4 grid gap-x-[var(--gutter)] md:col-span-8 md:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {why.points.map((pt) => (
            <li key={pt.title} className="border-t border-line pt-6 pb-10">
              <h3 className="t-h4">{pt.title}</h3>
              <p className="t-body-sm mt-3 text-fg-muted">{pt.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
