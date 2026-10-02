// Regenerates src/content/media/manifest.generated.json from docs/image-asset-manifest.csv.
// The CSV (derived from the layout families in IMAGE_ASSET_MANIFEST.md) is the single source
// for slot IDs, dimensions, ratios, priorities and replacement paths.
import { readFileSync, writeFileSync } from 'node:fs';

const CSV = 'docs/image-asset-manifest.csv';
const OUT = 'src/content/media/manifest.generated.json';

function parseCsv(text) {
  const rows = [];
  let row = [],
    field = '',
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const dims = (s) => {
  const m = /^(\d+)×(\d+)$/.exec(s.trim());
  return m ? { width: Number(m[1]), height: Number(m[2]) } : null;
};

const [header, ...rows] = parseCsv(readFileSync(CSV, 'utf8')).filter((r) => r.length > 1);
const col = (name) => header.indexOf(name);
const out = {};
for (const r of rows) {
  const id = r[col('Asset ID')];
  const path = r[col('Replacement path')];
  const [desktopPath, mobilePath] = path.split(' + ');
  out[id] = {
    id,
    page: r[col('Page')],
    section: r[col('Section')],
    purpose: r[col('Purpose')],
    family: r[col('Family')],
    desktop: dims(r[col('Desktop deliver (px)')]),
    desktopRatio: r[col('Desktop ratio')],
    mobile: dims(r[col('Mobile deliver (px)')]),
    mobileRatio: r[col('Mobile ratio')],
    separateMobile: r[col('Separate mobile art')] === 'Yes',
    priority: r[col('Priority')].split(' ')[0],
    fallback: r[col('Placeholder / fallback')],
    path: desktopPath.trim(),
    mobilePath: mobilePath ? mobilePath.trim() : null,
    templated: id.includes('{'),
  };
}
writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`image manifest: ${Object.keys(out).length} slots → ${OUT}`);
