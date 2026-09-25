// Copies the self-hosted Noto Sans SC (variable, OFL) into public/ so it is served from our own
// origin and requested ONLY on /zh pages (§15.2). Google's numbered unicode-range slices mean the
// browser downloads only the slices a page actually uses. Idempotent.
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const SRC = 'node_modules/@fontsource-variable/noto-sans-sc';
const OUT = 'public/fonts/noto-sans-sc';
if (!existsSync(`${OUT}/noto-sans-sc.css`)) {
  mkdirSync(OUT, { recursive: true });
  cpSync(`${SRC}/files`, `${OUT}/files`, { recursive: true, filter: (p) => !p.endsWith('.woff') });
  const css = readFileSync(`${SRC}/index.css`, 'utf8');
  writeFileSync(`${OUT}/noto-sans-sc.css`, `/* Noto Sans SC Variable — © Google, SIL Open Font License 1.1 (via @fontsource-variable/noto-sans-sc) */\n${css}`);
  console.log('fonts: Noto Sans SC copied to public/fonts/noto-sans-sc');
} else {
  console.log('fonts: Noto Sans SC already present');
}
