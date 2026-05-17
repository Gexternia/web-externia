import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNoticiasDigest } from '$lib/server/noticias';

const CACHE_CONTROL = 'public, max-age=300, s-maxage=300, stale-while-revalidate=600';

export const GET: RequestHandler = async ({ fetch }) => {
  try {
    const digest = await getNoticiasDigest(fetch);

    return json(digest, {
      headers: {
        'cache-control': CACHE_CONTROL
      }
    });
  } catch (error) {
    console.error('[api/noticias]', error);

    return json(
      { error: 'No se pudieron cargar las noticias' },
      {
        status: 502
      }
    );
  }
};
