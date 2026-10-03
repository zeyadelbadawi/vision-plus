import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/locales';
import { getCatalog } from '@/content';
import { LabFrameDriver } from '@/components/scenes/lab/lab-frame-driver';
import { LAB_SCENES } from '@/components/scenes/lab/lab-scenes';
import { MnvrOnboardScene } from '@/components/sections/solution/mnvr-onboard-scene';
import { MnvrRouteScene } from '@/components/sections/solution/mnvr-route-scene';
import { ElvScene } from '@/components/sections/solution/elv-scene';
import { scenes } from '@/content/data/scenes';
import { isPreview } from '@/lib/env';

/** One scene alone, for the scene lab's frame (P5B-01): rendered with the manual driver, driven by LabFrameDriver. */
export async function LabFrame({ locale, scene }: { locale: Locale; scene: string }) {
  if (!isPreview) notFound();
  setRequestLocale(locale);
  const entry = LAB_SCENES.find((s) => s.id === scene);
  if (!entry) notFound();
  const catalog = getCatalog(locale);
  const name = catalog.solutions['mobile-nvr-mobile-surveillance'].name;
  const elv = scenes.find((s) => s.id === 'elv-one-infrastructure')!;
  return (
    <main id="main" tabIndex={-1} className="lab-frame-main">
      <h1 className="sr-only">{entry.title}</h1>
      {entry.id === 'mnvr-route' ? (
        <section className="theme-dark bg-bg text-fg section-y">
          <div className="container-vp">
            <MnvrRouteScene locale={locale} name={name} driver="manual" />
          </div>
        </section>
      ) : entry.id === 'elv-one-infrastructure' ? (
        <section className="bg-bg-raised section-y">
          <div className="container-vp">
            <ElvScene locale={locale} scene={elv} name={catalog.solutions['elv-systems'].name} driver="manual" />
          </div>
        </section>
      ) : (
        <section className="mnvr-system section-y">
          <div className="container-vp">
            <MnvrOnboardScene locale={locale} driver="manual" />
          </div>
        </section>
      )}
      <LabFrameDriver kind={entry.kind} beats={entry.beats} />
    </main>
  );
}
