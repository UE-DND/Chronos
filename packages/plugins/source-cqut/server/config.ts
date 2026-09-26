export * from '../src/online/config';

/** Per-instance IP sliding window; not shared across Vercel instances. */
export const PREVIEW_RATE_LIMIT_MAX = 8;
export const PREVIEW_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
