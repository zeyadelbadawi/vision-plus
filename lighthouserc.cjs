// Lighthouse CI (MASTER_PROJECT_PLAN §37, §40). Mobile emulation (Lighthouse default), 3 runs per URL.
//
// Two tiers:
//  • error — hard gates that are deterministic enough for CI: accessibility = 100, best practices,
//    CLS, and the individual SEO audits.
//  • warn  — the plan's performance targets (score ≥ 0.95, LCP ≤ 2.5 s). Simulated (Lantern) scores on
//    shared CI runners vary by ±0.1 between identical runs (measured in P3), so they are reported, not
//    blocking, plus an error floor that catches real regressions. The ≥ 95 target is closed in P10.
//
// Preview builds are intentionally noindex (X-Robots-Tag + robots meta), so the SEO *category* score
// is capped at ~0.63 by `is-crawlable` alone; the other SEO audits are asserted one by one instead
// (robots.txt arrives with the sitemap in P7).
// The production gate (P7/P10) asserts SEO = 100 on a CONTENT_MODE=production build.
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'node scripts/serve-static.mjs',
      startServerReadyPattern: 'serving out/',
      url: [
        'http://localhost:4173/en',
        'http://localhost:4173/ar',
        'http://localhost:4173/zh',
        'http://localhost:4173/en/solutions/mobile-nvr-mobile-surveillance',
        'http://localhost:4173/en/solutions',
        'http://localhost:4173/en/services',
      ],
      numberOfRuns: 3,
      // Colour contrast is enforced by the Playwright + axe suite on every template × locale × 2 viewports,
      // excluding only the interim text wordmark (a logotype: WCAG 1.4.3 sets no contrast requirement).
      // Lighthouse cannot exclude one element, so its contrast audit is skipped rather than weakening the
      // accessibility = 100 gate for everything else.
      settings: { chromeFlags: '--no-sandbox --headless=new', skipAudits: ['color-contrast'] },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: '.*',
          assertions: {
            'categories:accessibility': ['error', { minScore: 1 }],
            'categories:best-practices': ['error', { minScore: 0.95 }],
            'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
            'categories:performance': ['error', { minScore: 0.6, aggregationMethod: 'median-run' }], // regression floor
            'document-title': 'error',
            'meta-description': 'error',
            'http-status-code': 'error',
            'link-text': 'error',
            'crawlable-anchors': 'error',
          },
        },
        {
          // Plan targets — reported on every run, closed in P10.
          matchingUrlPattern: '.*',
          assertions: {
            'categories:performance': ['warn', { minScore: 0.95, aggregationMethod: 'median-run' }],
            'largest-contentful-paint': ['warn', { maxNumericValue: 2500, aggregationMethod: 'median-run' }],
          },
        },
      ],
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci/reports' },
  },
};
