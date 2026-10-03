import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getAboutCopy, getCompany } from '@/content';
import { Link } from '@/i18n/navigation';
import { PageIntro } from '@/components/layout/page-intro';
import { Section } from '@/components/layout/section';
import { ImageSlot, slotVisible } from '@/components/media/image-slot';
import { HeroBand } from '@/components/sections/shared/hero-band';
import { SplitEditorial } from '@/components/sections/shared/split-editorial';
import { Timeline } from '@/components/sections/shared/timeline';
import { ArrowEnd } from '@/components/ui/icons';
import { isPreview } from '@/lib/env';
import { pageMetadata } from '@/lib/metadata';
import { textAttrs } from '@/lib/text-attrs';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return pageMetadata((await params).locale as Locale, 'about');
}

// F7 journey photos (`image:` keys so `assets:check` sees the IDs), in milestone order
const JOURNEY_MEDIA = [{ image: 'ABOUT-JOURNEY-2017' }, { image: 'ABOUT-JOURNEY-2021' }, { image: 'ABOUT-JOURNEY-TODAY' }] as const;

/**
 * About (MASTER_PROJECT_PLAN §26.8, P5A-07; notes §55.3.9): intro → in-page index → who we are → journey → vision →
 * interlude → mission → values → philosophy → why Vision Plus → links out. Every word is approved copy (`01` §02,
 * §03, §19, §23) or approved microcopy (D-18). Q-04: the Vision, Mission and Core Values statements are withheld
 * until the client supplies their wording, so only their labels render; their text is never output.
 */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, ta, tab, tc, tp] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'about' }),
    getTranslations({ locale, namespace: 'cta' }),
    getTranslations({ locale, namespace: 'preview' }),
  ]);
  const a = getAboutCopy(locale);
  const { why } = getCompany(locale);
  const tx = (t: string | undefined) => textAttrs(locale, t);
  const [lead, ...body] = a.whoWeAre.body;

  // Q-04: labels only. Nothing else from these entries is read here, so their text cannot reach the page.
  const withheld = [
    { id: 'vision', label: a.vision.eyebrow },
    { id: 'mission', label: a.mission.eyebrow },
    { id: 'values', label: a.values.eyebrow },
  ] as const;
  const withheldSection = ({ id, label }: (typeof withheld)[number]) => (
    <Section key={id} id={id} tone="canvas" labelledBy={`${id}-title`} spacing="sm">
      <div className="container-vp">
        <span className="seam mb-6 w-12" aria-hidden="true" />
        <h2 id={`${id}-title`} className="t-h2" {...tx(label)}>
          {label}
        </h2>
        {isPreview && <p className="pending-note t-caption">{tp('withheld')}</p>}
      </div>
    </Section>
  );

  const index = [
    { id: 'who-we-are', label: tn('aboutLinks.whoWeAre') },
    { id: 'journey', label: a.journey.eyebrow },
    ...withheld.map(({ id, label }) => ({ id, label })),
    { id: 'philosophy', label: a.philosophy.eyebrow },
    { id: 'why-vision-plus', label: tn('aboutLinks.why') },
  ];

  return (
    <main id="main" tabIndex={-1} className="about">
      <PageIntro
        locale={locale}
        crumbs={[{ label: tn('home'), href: '/' }, { label: tn('about') }]}
        crumbsLabel={ta('breadcrumb')}
        eyebrow={a.whoWeAre.eyebrow}
        title={a.whoWeAre.title}
      >
        <nav className="page-index" aria-labelledby="page-index-title">
          <h2 id="page-index-title" className="t-caption text-fg-muted">
            {tab('onThisPage')}
          </h2>
          <ul className="page-index__list">
            {index.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="link-text" {...tx(s.label)}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageIntro>
      <HeroBand locale={locale} id="ABOUT-HERO" />

      {/* 1. Who we are (01 §02) */}
      <Section id="who-we-are" tone="canvas" labelledBy="who-we-are-title">
        <div className="container-vp grid-vp gap-y-8">
          <h2 id="who-we-are-title" className="sr-only">
            {tn('aboutLinks.whoWeAre')}
          </h2>
          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-3">
            <p className="t-lede" {...tx(lead)}>
              {lead}
            </p>
            <div className="mt-8 grid gap-5">
              {body.map((p) => (
                <p key={p} className="t-body measure" {...tx(p)}>
                  {p}
                </p>
              ))}
            </div>
            <p className="t-h1 about__closing" {...tx(a.whoWeAre.closing)}>
              {a.whoWeAre.closing}
            </p>
          </div>
        </div>
      </Section>

      {/* 2. Journey (01 §03) */}
      <Section id="journey" tone="raised" labelledBy="journey-title">
        <div className="container-vp">
          <div data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <p className="t-caption text-fg-muted mb-4" {...tx(a.journey.eyebrow)}>
              {a.journey.eyebrow}
            </p>
            <h2 id="journey-title" className="t-h2" {...tx(a.journey.title)}>
              {a.journey.title}
            </h2>
          </div>
          <div className="mt-14 lg:mt-20">
            <Timeline locale={locale} items={a.journey.milestones.map((m, i) => ({ ...m, image: JOURNEY_MEDIA[i]?.image }))} />
          </div>
          <p className="t-h2 mt-16 border-t border-line pt-10" {...tx(a.journey.closing)}>
            {a.journey.closing}
          </p>
        </div>
      </Section>

      {/* 3. Vision (Q-04: label only) */}
      {withheldSection(withheld[0])}

      {/* 4. Interlude: image only; without the final image it does not render (its typographic fallback would need
          the withheld Vision line) */}
      {slotVisible('ABOUT-VISION') && (
        <div className="about__interlude">
          <ImageSlot id="ABOUT-VISION" locale={locale} sizes="100vw" />
        </div>
      )}

      {/* 5. Mission and 6. Values (Q-04: labels only) */}
      {withheldSection(withheld[1])}
      {withheldSection(withheld[2])}

      {/* 7. Philosophy (01 §23) */}
      <SplitEditorial locale={locale} id="philosophy" eyebrow={a.philosophy.eyebrow} title={a.philosophy.title} image="ABOUT-PHILOSOPHY">
        {a.philosophy.body.map((p) => (
          <p key={p} className="t-body measure" {...tx(p)}>
            {p}
          </p>
        ))}
        <ul className="about__lines">
          {a.philosophy.lines.map((l) => (
            <li key={l} className="t-h3" {...tx(l)}>
              {l}
            </li>
          ))}
        </ul>
      </SplitEditorial>

      {/* 8. Why Vision Plus (01 §19): all 8 points; an editorial list, not numbered, not cards */}
      <Section id="why-vision-plus" tone="raised" labelledBy="why-title">
        <div className="container-vp">
          <div data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <h2 id="why-title" className="t-h1 max-w-[18ch]" {...tx(why.title)}>
              {why.title}
            </h2>
          </div>
          <ul className="editorial-list mt-12 lg:mt-16">
            {why.points.map((pt) => (
              <li key={pt.title} className="editorial-list__item">
                <h3 className="t-h3" {...tx(pt.title)}>
                  {pt.title}
                </h3>
                <p className="t-body mt-3 text-fg-muted" {...tx(pt.text)}>
                  {pt.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* 9. Links out */}
      <Section tone="canvas" labelledBy="about-more-title" spacing="sm">
        <div className="container-vp">
          <h2 id="about-more-title" className="sr-only">
            {tn('about')}
          </h2>
          <ul className="link-blocks">
            {[
              { href: '/partners', label: tc('viewPartners') },
              { href: '/company-profile', label: tc('companyProfile') },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-blocks__link t-h2">
                  <span>{l.label}</span>
                  <ArrowEnd size={28} className="link-blocks__arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </main>
  );
}
