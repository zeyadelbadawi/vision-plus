import { cn } from '@/lib/cn';

/**
 * INTERIM typographic wordmark — preview only (IMAGE_ASSET_MANIFEST: BRAND-LOGO, P0).
 * It is NOT the official logo and must be replaced by the client's vector files (D-05)
 * before any public release. Styling mirrors the approved Option B reference lock-up.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('wordmark', className)} dir="ltr" lang="en">
      <span>VISION</span> <span className="wordmark__plus">PLUS</span>
    </span>
  );
}
