import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getHome } from '@/content';
import { ImageSlot, slotVisible } from '@/components/media/image-slot';
import { LinkButton } from '@/components/ui/button';
import { cn } from '@/lib/cn';

/**
 * Mobile NVR chapter (§26.1 #4) — the differentiator. Charcoal chapter with half-bleed HOME-MNVR (F3).
 * Motion is deliberately limited to the equation: a gold signal passes through the five terms
 * (Video → … → Intelligence), so the full scene stays special to the solution page (§23.6.9).
 */
export async function HomeMobileNvr({ locale }: { locale: Locale }) {
  const { mobileNvr: m } = getHome(locale);
  const tc = await getTranslations({ locale, namespace: 'cta' });
  const withImage = slotVisible('HOME-MNVR');
  return (
    <section aria-labelledby="mnvr-title" className="mnvr theme-dark bg-bg text-fg">
      <div className={cn('mnvr__grid', !withImage && 'mnvr__grid--text')}>
        <div className="mnvr__content">
          <div data-reveal="">
            <span className="seam mb-6 w-12" aria-hidden="true" />
            <h2 id="mnvr-title" className="t-h1 max-w-[16ch]">
              {m.title}
            </h2>
          </div>
          <div className="mt-8 grid gap-5">
            <p className="t-lede">{m.body[0]}</p>
            <p className="t-body text-fg-muted measure">{m.body[1]}</p>
          </div>

          <div className="mnvr__insight">
            <p className="t-body-sm text-fg-muted">{m.insight.before}</p>
            <p className="t-h4 mt-3">{m.insight.after}</p>
          </div>

          <div className="equation" data-reveal="">
            <p className="sr-only">{m.equation.join(' + ')}</p>
            <p className="equation__terms" aria-hidden="true">
              {m.equation.map((term, i) => (
                <span key={term} className="equation__term" style={{ '--i': i } as React.CSSProperties}>
                  {i > 0 && <span className="equation__plus">+</span>}
                  <span>{term}</span>
                </span>
              ))}
            </p>
            <span className="equation__track" aria-hidden="true">
              <span className="equation__signal" />
            </span>
          </div>

          <div className="mt-10">
            <LinkButton href="/solutions/mobile-nvr-mobile-surveillance" variant="primary">
              {tc('exploreMnvr')}
            </LinkButton>
          </div>
        </div>
        {withImage && (
          <div className="mnvr__media">
            <ImageSlot id="HOME-MNVR" locale={locale} fill sizes="(min-width: 1024px) 50vw, 100vw" labelAlign="top-end" />
          </div>
        )}
      </div>

      <div className="container-vp mnvr__apps">
        <h3 className="t-caption text-fg-muted">{m.applicationsTitle}</h3>
        <ul className="mnvr__apps-list">
          {m.applications.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
