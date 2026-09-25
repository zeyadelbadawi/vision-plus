import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// RTL guard (§14.1): physical-direction Tailwind classes are banned — use logical ones
// (ms-/me-/ps-/pe-/inset-s-/inset-e-/text-start/text-end). `start-*`/`end-*` are deprecated in Tailwind 4.2+.
const PHYSICAL = '(^|\\s)-?(ml|mr|pl|pr|left|right|start|end|border-l|border-r|rounded-l|rounded-r)-|(^|\\s)text-(left|right)(\\s|$)';

const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts', 'public/**', 'test-results/**', 'playwright-report/**'] },
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `JSXAttribute[name.name='className'] Literal[value=/${PHYSICAL}/]`,
          message: 'Use logical Tailwind utilities (ms/me/ps/pe/inset-s/inset-e/text-start/text-end) so layouts mirror in RTL.',
        },
      ],
    },
  },
];

export default config;
