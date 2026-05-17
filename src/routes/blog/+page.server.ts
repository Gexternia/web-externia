import type { PageServerLoad } from './$types';
import { getNoticiasDigest } from '$lib/server/noticias';

const CACHE_CONTROL = 'public, max-age=300, s-maxage=300, stale-while-revalidate=600';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
  setHeaders({
    'cache-control': CACHE_CONTROL
  });

  try {
    const digest = await getNoticiasDigest(fetch);
    return { digest, error: false };
  } catch (error) {
    console.error('[blog/+page.server]', error);

    return {
      digest: { semana: '', noticias: [] },
      error: true
    };
  }
};
