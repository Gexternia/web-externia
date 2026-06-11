import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTravelManagerDigest } from '$lib/server/travel-manager';

const CACHE_CONTROL = 'public, max-age=300, s-maxage=300, stale-while-revalidate=600';

export const GET: RequestHandler = async ({ fetch }) => {
  try {
    const digest = await getTravelManagerDigest(fetch);

    return json(digest, {
      headers: {
        'cache-control': CACHE_CONTROL
      }
    });
  } catch (error) {
    console.error('[api/travel-manager]', error);

    return json(
      { error: 'No se pudieron cargar las noticias de Travel Manager' },
      {
        status: 502
      }
    );
  }
};
