import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCompany, getSamplesCopy, offices } from '@/content';
import { sampleOffices } from '@/content/data/samples';
import { ImageSlot, slotVisible } from '@/components/media/image-slot';
import { isPreview } from '@/lib/env';
import { ClickToLoadMap } from './click-to-load-map';

const MAP_SLOTS = { qatar: 'CONTACT-MAP-QATAR', egypt: 'CONTACT-MAP-EGYPT' } as const;

/**
 * Office blocks (MASTER_PROJECT_PLAN §26.10, §42.4; notes §55.3.13). Every value comes from data/locations.json,
 * which is still empty (D-01, D-02, D-03): preview shows the labelled sample details as plain text (never tel:/mailto:
 * links, D-04) and the labelled map placeholder; content:check fails a production build while any value is missing.
 * With real data the block renders the address, tel:/mailto: links, directions and the click-to-load map.
 */
export async function OfficeBlocks({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'contact' });
  const company = getCompany(locale);
  const samples = getSamplesCopy(locale);

  return (
    <div className="offices">
      {offices.map((o, i) => {
        const sample = isPreview && !(o.address && o.phone && o.email);
        const address = o.address ?? (sample ? samples.offices[o.key].address : null);
        const mapSlot = MAP_SLOTS[o.key];
        return (
          <article key={o.key} className="office" aria-labelledby={`office-${o.key}`} data-sample={sample ? '' : undefined}>
            <h3 id={`office-${o.key}`} className="t-h3">
              {company.markets[i]}
            </h3>
            <dl className="office__facts">
              {address && (
                <div>
                  <dt>{t('address')}</dt>
                  <dd>{address}</dd>
                </div>
              )}
              {(o.phone || sample) && (
                <div>
                  <dt>{t('phone')}</dt>
                  <dd dir="ltr">
                    {o.phone ? (
                      <a href={`tel:${o.phone.replace(/[\s-]/g, '')}`} className="link-text">
                        {o.phone}
                      </a>
                    ) : (
                      sampleOffices[o.key].phone
                    )}
                  </dd>
                </div>
              )}
              {(o.email || sample) && (
                <div>
                  <dt>{t('email')}</dt>
                  <dd dir="ltr">
                    {o.email ? (
                      <a href={`mailto:${o.email}`} className="link-text">
                        {o.email}
                      </a>
                    ) : (
                      sampleOffices[o.key].email
                    )}
                  </dd>
                </div>
              )}
            </dl>
            {sample && <p className="sample-tag mt-3">{samples.dataLabel}</p>}
            {o.mapUrl && (
              <a href={o.mapUrl} className="link-text office__directions" target="_blank" rel="noopener noreferrer">
                {t('getDirections')}
              </a>
            )}
            {o.mapEmbedSrc ? (
              <ClickToLoadMap
                src={o.mapEmbedSrc}
                title={`${company.markets[i]} — ${address ?? ''}`}
                buttonLabel={t('loadMap')}
                notice={t('mapNotice')}
                poster={
                  slotVisible(mapSlot) ? (
                    <ImageSlot id={mapSlot} locale={locale} sizes="(min-width: 1024px) 35vw, 100vw" />
                  ) : (
                    <div className="office-map__surface">{address}</div>
                  )
                }
              />
            ) : (
              isPreview && (
                <div className="office-map">
                  <ImageSlot id={mapSlot} locale={locale} sizes="(min-width: 1024px) 35vw, 100vw" />
                </div>
              )
            )}
          </article>
        );
      })}
    </div>
  );
}
