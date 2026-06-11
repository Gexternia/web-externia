import type { PageServerLoad } from './$types';
import { getTravelManagerDigest } from '$lib/server/travel-manager';

const CACHE_CONTROL = 'public, max-age=300, s-maxage=300, stale-while-revalidate=600';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
  setHeaders({
    'cache-control': CACHE_CONTROL
  });

  try {
    const digest = await getTravelManagerDigest(fetch);
    return { digest, error: false };
  } catch (error) {
    console.error('[blog/travel-manager/+page.server]', error);

    return {
      digest: { semana: '', noticias: [] },
      error: true
    };
  }
};
