import type { PageServerLoad } from './$types';
import { getTravelManagerNoticiaById } from '$lib/server/travel-manager';

const CACHE_CONTROL = 'public, max-age=300, s-maxage=300, stale-while-revalidate=600';

export const load: PageServerLoad = async ({ params, fetch, setHeaders }) => {
  setHeaders({
    'cache-control': CACHE_CONTROL
  });

  const idNum = parseInt(params.id, 10);

  if (Number.isNaN(idNum) || idNum < 0) {
    return { noticia: null, error: true };
  }

  try {
    const noticia = await getTravelManagerNoticiaById(idNum, fetch);
    return { noticia, error: !noticia };
  } catch (error) {
    console.error('[blog/travel-manager/[id]/+page.server]', error);
    return { noticia: null, error: true };
  }
};
