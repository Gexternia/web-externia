import type { PageServerLoad } from './$types';
import { getNoticiasDigest } from '$lib/server/noticias';

const CACHE_CONTROL = 'public, max-age=300, s-maxage=300, stale-while-revalidate=600';

export const load: PageServerLoad = async ({ params, fetch, setHeaders }) => {
  setHeaders({
    'cache-control': CACHE_CONTROL
  });

  const idNum = parseInt(params.id, 10);
  const empty = { noticia: null, error: true, id: 0, total: 0, semana: '', prev: null, next: null };

  if (Number.isNaN(idNum) || idNum < 0) {
    return empty;
  }

  try {
    const { semana, noticias } = await getNoticiasDigest(fetch);
    const noticia = noticias[idNum] ?? null;
    const link = (i: number) => (noticias[i] ? { id: i, titulo: noticias[i].titulo || 'Sin título' } : null);
    return {
      noticia,
      error: !noticia,
      id: idNum,
      total: noticias.length,
      semana,
      prev: link(idNum - 1),
      next: link(idNum + 1)
    };
  } catch (error) {
    console.error('[blog/[id]/+page.server]', error);
    return empty;
  }
};
