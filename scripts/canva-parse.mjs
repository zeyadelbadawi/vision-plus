// pnpm canva:parse "<Canva embed HTML>" — prints the validated config entry for src/content/company-profile.ts
// (MASTER_PROJECT_PLAN §33). Only the iframe src and aspect ratio are kept; the pasted HTML is never stored.
import { parseCanvaEmbed } from '../src/features/company-profile/canva.ts';

const html = process.argv.slice(2).join(' ');
if (!html.trim()) {
  console.error('Usage: pnpm canva:parse "<div …><iframe … src=\\"https://www.canva.com/design/…/view?embed\\" …></iframe></div>"');
  process.exit(1);
}
try {
  const embed = parseCanvaEmbed(html);
  console.log(JSON.stringify({ ...embed, status: 'final' }, null, 2));
  console.log('\nPaste this as the locale entry in src/content/company-profile.ts (embeds.en / .ar / .zh).');
} catch (e) {
  console.error(`canva:parse — ${e.message}`);
  process.exit(1);
}
