// Slot lookup shared by the image scripts. An ID that is not in the manifest may be a concrete instance of a
// templated slot (e.g. PROJ-sample-fleet-surveillance-COVER for PROJ-{slug}-COVER): it gets the template's spec with
// the slug filled into its ID and file paths. Same rules as instanceOf() in src/content/media/index.ts.
export function resolveSlot(manifest, id) {
  if (manifest[id]) return manifest[id];
  for (const t of Object.values(manifest)) {
    if (!t.templated || !t.id.includes('{slug}') || /\{(?!slug\})/.test(t.id)) continue;
    const slug = new RegExp(`^${t.id.replace('{slug}', '([a-z0-9-]+)')}$`).exec(id)?.[1];
    if (!slug) continue;
    const fill = (p) => p.replace('{slug}', slug);
    return { ...t, id, path: fill(t.path), mobilePath: t.mobilePath && fill(t.mobilePath), templated: false };
  }
  return undefined;
}
