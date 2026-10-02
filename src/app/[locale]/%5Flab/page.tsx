import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog, getCompany } from '@/content';
import { industries } from '@/content/data/registry';
import { PageIntro } from '@/components/layout/page-intro';
import { ImageSlot } from '@/components/media/image-slot';
import { LinkButton } from '@/components/ui/button';
import { Equation } from '@/components/ui/equation';
import { isPreview } from '@/lib/env';
import '@/styles/forms.css';

/**
 * Live style guide (MASTER_PROJECT_PLAN §49.1 P2): tokens, type scale in en/ar/zh, buttons, form controls,
 * image placeholders and seam motifs, rendered with the real design system. Preview builds only — it is
 * never part of a production build (robots also disallow /_lab, §36). Section labels here are internal
 * tooling text, not website copy; every sample sentence is approved copy or declared draft microcopy.
 */
export const metadata: Metadata = { title: 'Style guide', robots: { index: false, follow: false } };

const PALETTE = [
  ['Gold', '--color-gold', '#D4AF37', 'Signal, active state, seams. Text only on charcoal (7.84:1).'],
  ['Charcoal', '--color-charcoal', '#1F1F1F', 'Primary text; dark chapters.'],
  ['Gray dark', '--color-gray-dark', '#3A3A3A', 'Raised surfaces on charcoal.'],
  ['Gray mid', '--color-gray-mid', '#6B6B6B', 'Muted text on light (5.33:1 on white).'],
  ['Gray light', '--color-gray-light', '#E5E5E5', 'Hairlines on light.'],
  ['Off-white', '--color-off-white', '#F8F8F8', 'Page canvas.'],
  ['White', '--color-white', '#FFFFFF', 'Raised surfaces; text on charcoal.'],
] as const;

const SCALE = ['t-display-xl', 't-display', 't-h1', 't-h2', 't-h3', 't-h4', 't-lede', 't-body', 't-body-sm', 't-caption'] as const;

export default async function StyleGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  if (!isPreview) notFound();
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const [tn, ta, tp, tf, tc] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'preview' }),
    getTranslations({ locale, namespace: 'form' }),
    getTranslations({ locale, namespace: 'cta' }),
  ]);
  const scripts = (['en', 'ar', 'zh'] as const).map((l) => ({ l, company: getCompany(l), dir: l === 'ar' ? 'rtl' : 'ltr', lang: l === 'zh' ? 'zh-Hans' : l }));
  const c = getCatalog(locale);

  return (
    <main id="main" tabIndex={-1} className="lab">
      <PageIntro
        locale={locale}
        crumbs={[{ label: tn('home'), href: '/' }, { label: tp('labTitle') }]}
        crumbsLabel={ta('breadcrumb')}
        title={tp('labTitle')}
        lede={tp('labIntro')}
      />

      <div className="container-vp lab__body">
        <section aria-labelledby="lab-colour">
          <h2 id="lab-colour" className="t-h2">
            Colour — Option B
          </h2>
          <ul className="lab__swatches">
            {PALETTE.map(([name, token, hex, use]) => (
              <li key={token}>
                <span className="lab__swatch" style={{ background: `var(${token})` }} />
                <span className="t-h4">{name}</span>
                <code className="t-caption">
                  {token} · {hex}
                </code>
                <span className="t-caption text-fg-muted">{use}</span>
              </li>
            ))}
          </ul>
          <div className="lab__surfaces">
            <div className="lab__surface bg-bg text-fg">
              Light surface — fg / fg-muted / line <span className="text-fg-muted">muted</span>
            </div>
            <div className="lab__surface theme-dark bg-bg text-fg">
              Charcoal chapter — <span style={{ color: 'var(--accent-fg)' }}>gold accent text</span> <span className="text-fg-muted">muted</span>
            </div>
          </div>
        </section>

        <section aria-labelledby="lab-type">
          <h2 id="lab-type" className="t-h2">
            Typography — scale × script
          </h2>
          <p className="t-caption text-fg-muted mt-2">
            IBM Plex Sans · IBM Plex Sans Arabic · Noto Sans SC (Chinese webfont loads on /zh only). Arabic and Chinese samples are draft translations (not
            approved).
          </p>
          {scripts.map(({ l, company, dir, lang }) => (
            <div key={l} lang={lang} dir={dir} className="lab__script">
              <p className="t-caption text-fg-muted">{lang}</p>
              {SCALE.map((cls) => (
                <p key={cls} className={cls}>
                  <span className="lab__token" dir="ltr">
                    {cls}
                  </span>{' '}
                  {cls.startsWith('t-display') || cls === 't-h1' ? company.tagline.join(' ') : company.why.points[1]!.text}
                </p>
              ))}
            </div>
          ))}
        </section>

        <section aria-labelledby="lab-buttons">
          <h2 id="lab-buttons" className="t-h2">
            Buttons &amp; links
          </h2>
          <div className="lab__row">
            <LinkButton href="/contact?type=consultation">{tc('consultation')}</LinkButton>
            <LinkButton href="/solutions" variant="secondary">
              {tc('exploreSolutions')}
            </LinkButton>
            <LinkButton href="/services#approach" variant="text">
              {tc('approach')}
            </LinkButton>
          </div>
          <div className="lab__row theme-dark bg-bg text-fg lab__surface">
            <LinkButton href="/contact?type=consultation">{tc('consultation')}</LinkButton>
            <LinkButton href="/solutions" variant="secondary">
              {tc('exploreSolutions')}
            </LinkButton>
            <LinkButton href="/services#approach" variant="text">
              {tc('approach')}
            </LinkButton>
          </div>
        </section>

        <section aria-labelledby="lab-forms">
          <h2 id="lab-forms" className="t-h2">
            Form controls
          </h2>
          <p className="t-caption text-fg-muted mt-2">Draft microcopy (D-18). The working form, validation and anti-spam are Phase 6.</p>
          <form className="lab__form" action="#" aria-label={tf('title')}>
            <fieldset className="field">
              <legend className="field__label">{tf('type.label')}</legend>
              <div className="segmented">
                {(['consultation', 'product', 'general', 'partnership'] as const).map((k, i) => (
                  <label key={k}>
                    <input type="radio" name="type" value={k} defaultChecked={i === 0} />
                    {tf(`type.${k}`)}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field">
              <label className="field__label" htmlFor="lab-name">
                {tf('name.label')}
              </label>
              <input id="lab-name" className="input" autoComplete="name" />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="lab-email">
                {tf('email.label')}
              </label>
              <input
                id="lab-email"
                className="input"
                type="email"
                dir="ltr"
                autoComplete="email"
                aria-invalid="true"
                aria-describedby="lab-email-error"
                defaultValue="name@"
              />
              <p id="lab-email-error" className="field__error">
                {tf('errors.email')}
              </p>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="lab-phone">
                {tf('phone.label')} <span className="field__optional">({tf('optional')})</span>
              </label>
              <input id="lab-phone" className="input" type="tel" dir="ltr" autoComplete="tel" aria-describedby="lab-phone-hint" />
              <p id="lab-phone-hint" className="field__hint">
                {tf('phone.hint')}
              </p>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="lab-industry">
                {tf('industry.label')}
              </label>
              <select id="lab-industry" className="select" defaultValue="">
                <option value="" disabled />
                {industries.map((i) => (
                  <option key={i.slug} value={i.slug}>
                    {c.industries[i.slug].name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="lab-message">
                {tf('message.label')}
              </label>
              <textarea id="lab-message" className="textarea" aria-describedby="lab-message-hint" />
              <p id="lab-message-hint" className="field__hint">
                {tf('message.hint')}
              </p>
            </div>
            <label className="check">
              <input type="checkbox" />
              <span>
                {tf.rich('consent.label', {
                  privacy: (chunks) => (
                    <a className="link-text" href={`/${locale}/privacy`}>
                      {chunks}
                    </a>
                  ),
                })}
              </span>
            </label>
            <button type="button" className="btn btn--primary w-fit">
              {tf('submit')}
            </button>
          </form>
        </section>

        <section aria-labelledby="lab-images">
          <h2 id="lab-images" className="t-h2">
            Image slots (manifest families)
          </h2>
          <div className="lab__images">
            <figure>
              <ImageSlot id="HOME-HERO" locale={locale} sizes="(min-width: 1024px) 45vw, 100vw" />
              <figcaption className="t-caption text-fg-muted">F1 · final client banner</figcaption>
            </figure>
            <figure>
              <ImageSlot id="SOL-MNVR-HERO" locale={locale} sizes="(min-width: 1024px) 45vw, 100vw" />
              <figcaption className="t-caption text-fg-muted">F2 · placeholder</figcaption>
            </figure>
            <figure>
              <ImageSlot id="HOME-STATEMENT" locale={locale} sizes="(min-width: 1024px) 30vw, 100vw" />
              <figcaption className="t-caption text-fg-muted">F4 · placeholder</figcaption>
            </figure>
            <figure>
              <ImageSlot id="IND-TRANSPORT" locale={locale} sizes="(min-width: 1024px) 20vw, 50vw" compact />
              <figcaption className="t-caption text-fg-muted">F5 · compact placeholder</figcaption>
            </figure>
          </div>
        </section>

        <section aria-labelledby="lab-motion" className="theme-dark bg-bg text-fg lab__surface">
          <h2 id="lab-motion" className="t-h2">
            Seams, signals &amp; activation
          </h2>
          <div data-reveal="" className="mt-8">
            <span className="seam w-48" aria-hidden="true" />
            <p className="t-caption text-fg-muted mt-3">Seam draw (once, on entry; drawn in reduced motion)</p>
          </div>
          <div className="mt-10">
            <Equation terms={['Video', 'Location', 'Connectivity', 'Data', 'Intelligence']} />
            <p className="t-caption text-fg-muted mt-3">Signal travel through approved terms (01 §08)</p>
          </div>
          <div className="mt-10">
            <LinkButton href="/solutions/mobile-nvr-mobile-surveillance" variant="secondary">
              {c.solutions['mobile-nvr-mobile-surveillance'].name}
            </LinkButton>
            <p className="t-caption text-fg-muted mt-3">Scene engine: the Route scene (pinned, stepped and reduced-motion modes)</p>
          </div>
        </section>

        <section aria-labelledby="lab-grid">
          <h2 id="lab-grid" className="t-h2">
            Grid — 4 / 8 / 12 columns
          </h2>
          <div className="grid-vp lab__grid" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className={i >= 4 ? (i >= 8 ? 'hidden lg:block' : 'hidden md:block') : ''} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
