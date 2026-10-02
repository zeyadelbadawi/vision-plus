import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/locales';

// Static fallback for "/". In production the Cloudflare Worker negotiates the locale
// (cookie → Accept-Language → en) before this file is ever served (§11, §42).
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
