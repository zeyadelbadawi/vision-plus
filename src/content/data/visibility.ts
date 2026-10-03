/**
 * Page visibility set by client decision. A hidden page keeps its route component, copy and data so it can be
 * re-enabled by flipping its flag; while hidden it is not built, not linked from navigation, and sitemap
 * aliases that point to it are not emitted (scripts/postbuild.mjs only emits redirects to pages that exist).
 */
export const pageVisibility = {
  // Q-02 (client, 2026-10-02): Option B — hidden until verified product data is supplied and its publication is
  // approved (D-09). The product-category data and the page template stay ready.
  products: false,
} as const;

/**
 * `output: export` refuses a dynamic route whose generateStaticParams() returns nothing. A detail route with no
 * publishable entries (production Projects before real data, D-10) therefore emits this one placeholder slug, whose
 * page calls notFound(); scripts/postbuild.mjs then removes it so it can never be served (no soft 404).
 */
export const UNPUBLISHED_SLUG = '_unpublished';
