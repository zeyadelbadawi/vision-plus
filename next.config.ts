import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Static export (plan §28 / §42): every page is prerendered; the only runtime
// endpoint (contact form) will live in a Cloudflare Worker, not in Next.
const config: NextConfig = {
  output: 'export',
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  // Images are optimised at build time by scripts/images.mjs (plan T-10),
  // and rendered with our own <Picture> component — next/image is not used.
  images: { unoptimized: true },
  env: {
    CONTENT_MODE: process.env.CONTENT_MODE ?? 'preview',
  },
};

export default withNextIntl(config);
