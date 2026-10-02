import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCompany } from '@/content';
import { ImageSlot } from '@/components/media/image-slot';
import { HeroPlaceholderArt } from '@/components/media/hero-placeholder-art';
import { getFinal, isFinal } from '@/content/media';
import { cn } from '@/lib/cn';
import { isPreview } from '@/lib/env';
import { LinkButton } from '@/components/ui/button';

/**
 * Home hero (§26.1 #1). Dark chapter, HOME-HERO (F1) full-bleed on ≥768, 4:5 art above the
 * text on mobile. The headline sits at the inline-start bottom (inside the manifest's outer text
 * band); the gold seam runs from the headline to the viewport edge — the brand's signature line.
 */
export async function HomeHero({ locale }: { locale: Locale }) {
  const company = getCompany(locale);
  const [tc, th] = await Promise.all([getTranslations({ locale, namespace: 'cta' }), getTranslations({ locale, namespace: 'home' })]);

  // Artwork-specific composition: text stays on the side the artwork keeps clear (e.g. a banner with a
  // baked-in logo on the right keeps text on the left in every locale, including RTL).
  const textZone = getFinal('HOME-HERO')?.textZone ?? 'inline-start';
  return (
    <section aria-labelledby="hero-title" className={cn('hero theme-dark', textZone === 'left' && 'hero--text-left')}>
      <div className="hero__media">
        <ImageSlot id="HOME-HERO" locale={locale} fill priority maskReveal sizes="100vw" labelAlign="top-end" />
        {isPreview && !isFinal('HOME-HERO') && <HeroPlaceholderArt />}
        <span className="hero__scrim" aria-hidden="true" />
      </div>

      <div className="hero__body container-vp">
        <p className="hero__markets">
          <span className="sr-only">{th('marketsLabel')}: </span>
          {company.markets.map((m, i) => (
            <span key={m}>
              {i > 0 && <span aria-hidden="true" className="hero__markets-sep" />}
              {m}
            </span>
          ))}
        </p>
        <h1 id="hero-title" className="t-display-xl hero__title">
          <span className="block">{company.tagline[0]}</span>
          <span className="block text-accent-fg">{company.tagline[1]}</span>
        </h1>
        <span className="hero__seam seam seam-onload" aria-hidden="true" />
        <div className="hero__foot">
          <p className="t-lede hero__descriptor">{company.descriptor}</p>
          <div className="hero__ctas">
            {/* The consultation CTA lives in the header; the hero offers the two ways into the story. */}
            <LinkButton href="/solutions" variant="primary">
              {tc('exploreSolutions')}
            </LinkButton>
            <LinkButton href="/services#approach" variant="secondary">
              {tc('approach')}
            </LinkButton>
          </div>
        </div>
      </div>

      <div className="hero__capabilities container-vp">
        <h2 className="sr-only">{th('capabilitiesLabel')}</h2>
        <ul>
          {company.capabilityLine.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
