import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getHome } from '@/content';
import { Section, SectionHeading } from '@/components/layout/section';
import { LinkButton } from '@/components/ui/button';
import { ArrowEnd } from '@/components/ui/icons';

/** Journey strip (§26.1 #10): Qatar 2017 → Egypt 2021 → Today. A real sequence; the seam connects it. */
export async function HomeJourney({ locale }: { locale: Locale }) {
  const { journey } = getHome(locale);
  const tc = await getTranslations({ locale, namespace: 'cta' });
  return (
    <Section tone="raised" labelledBy="journey-title">
      <div className="container-vp">
        <SectionHeading id="journey-title" title={journey.title} />
        <ol className="journey mt-14 lg:mt-20" data-reveal="">
          {journey.milestones.map((m, i) => (
            <li key={m.title} className="journey__step" style={{ '--i': i } as React.CSSProperties}>
              <span className="journey__line" aria-hidden="true">
                <span className="journey__fill" />
              </span>
              <span className="journey__node" aria-hidden="true" />
              <p className="journey__when t-num">
                <span className="t-display">{m.when}</span>
                {m.where && <span className="journey__where">{m.where}</span>}
              </p>
              <h3 className="t-h3 mt-6">{m.title}</h3>
              <p className="t-body-sm mt-3 max-w-[40ch] text-fg-muted">{m.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <LinkButton href="/about#journey" variant="text">
            {tc('ourStory')}
            <ArrowEnd size={16} />
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
