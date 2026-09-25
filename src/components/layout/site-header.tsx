import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { localeMeta, locales } from '@/i18n/locales';
import { getNavigation } from '@/content/navigation';
import { ImageSlot } from '@/components/media/image-slot';
import { HeaderClient } from './header-client';

/** Server wrapper: builds the localized navigation model and hands it to the header island. */
export async function SiteHeader({ locale }: { locale: Locale }) {
  const [items, t, tc] = await Promise.all([
    getNavigation(locale),
    getTranslations({ locale, namespace: 'a11y' }),
    getTranslations({ locale, namespace: 'cta' }),
  ]);
  return (
    <HeaderClient
      items={items}
      locale={locale}
      locales={locales.map((code) => ({ code, ...localeMeta[code] }))}
      cta={{ href: '/contact?type=consultation', label: tc('consultation') }}
      labels={{
        home: t('home'),
        mainNav: t('mainNav'),
        mobileNav: t('mobileNav'),
        openMenu: t('openMenu'),
        closeMenu: t('closeMenu'),
        language: t('language'),
      }}
      featuredMedia={<ImageSlot id="SOL-MNVR-CARD" locale={locale} sizes="(min-width: 1280px) 400px, 50vw" labelAlign="bottom-start" />}
    />
  );
}
