import type { Metadata } from 'next';
import type { Locale } from '@/i18n/locales';
import { LabFrame } from '@/components/scenes/lab/lab-frame';
import '@/styles/pages.css';
import '@/styles/mnvr.css';
import '@/styles/lab.css';

export const metadata: Metadata = { title: 'Scene lab frame', robots: { index: false, follow: false } };

// Scene lab frame for mnvr-onboard (P5B-01, preview only). A static route: the export does not expand a dynamic segment
// under the encoded %5Flab folder.
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  return <LabFrame locale={(await params).locale as Locale} scene="mnvr-onboard" />;
}
