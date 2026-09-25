// Option B guard (§22.1): fail if any rejected Option A colour appears in source.
import { execSync } from 'node:child_process';
const OPTION_A = ['1464E8', '0B1B36', '122A4A', 'EAF2FF', '667085', 'E8EDF3'];
const hits = execSync(`grep -rniE "#(${OPTION_A.join('|')})\\b" src messages scripts --include=*.{ts,tsx,css,json,mjs} || true`, { encoding: 'utf8' }).trim();
if (hits) {
  console.error('brand-check: rejected Option A colours found:\n' + hits);
  process.exit(1);
}
console.log('brand-check: Option B only ✓');
