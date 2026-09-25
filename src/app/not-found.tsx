import '@/styles/globals.css';
import { plexArabic, plexSans } from '@/styles/fonts';
import Link from 'next/link';
import { Wordmark } from '@/components/ui/wordmark';

// Global 404 for unknown paths outside a locale (static hosts serve out/404.html).
// Trilingual and typographic by design — no imagery.
export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={`${plexSans.variable} ${plexArabic.variable}`}>
      <body className="theme-dark bg-bg text-fg">
        <main className="container-vp flex min-h-svh flex-col justify-center gap-10 py-24">
          <Link href="/en" aria-label="VISION PLUS — home">
            <Wordmark className="text-[1.5rem]" />
          </Link>
          <span className="seam w-12" aria-hidden="true" />
          <h1 className="t-display max-w-[16ch]">Page not found.</h1>
          <p className="t-lede max-w-[40rem] text-fg-muted">
            The page you requested doesn&apos;t exist or has moved.
          </p>
          <ul className="flex flex-wrap gap-4">
            <li><Link className="btn btn--primary" href="/en">Go to the homepage</Link></li>
            <li><Link className="btn btn--secondary" href="/ar" lang="ar" dir="rtl">الصفحة الرئيسية</Link></li>
            <li><Link className="btn btn--secondary" href="/zh" lang="zh-Hans">返回首页</Link></li>
          </ul>
        </main>
      </body>
    </html>
  );
}
