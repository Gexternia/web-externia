import type { Handle } from '@sveltejs/kit';
import { promoteSeoTagsInHead } from '$lib/seo/promote-head';

export const handle: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    transformPageChunk: ({ html }) => promoteSeoTagsInHead(html)
  });
};
