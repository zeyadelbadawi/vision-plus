/** Build-time content mode (§12.3). `preview` shows placeholders and draft content; `production` is gated. */
export const contentMode: 'preview' | 'production' = process.env.CONTENT_MODE === 'production' ? 'production' : 'preview';
export const isPreview = contentMode === 'preview';
