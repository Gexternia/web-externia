import { getNoticiasList } from '$lib/noticias-api';
import type { NoticiaItem } from '$lib/types/noticias';
import type { PageLoad } from './$types';

export const entries = async () => {
  try {
    const noticias = await getNoticiasList();
    return noticias.map((_, i) => ({ id: String(i) }));
  } catch (e) {
    console.warn('[prerender] /blog/[id]: no se pudo leer la API de noticias:', e);
    return [];
  }
};

export const load: PageLoad = async ({ params }): Promise<{
  noticia: NoticiaItem | null;
  error: boolean;
}> => {
  const idNum = parseInt(params.id, 10);
  if (Number.isNaN(idNum) || idNum < 0) {
    return { noticia: null, error: true };
  }
  try {
    const noticias = await getNoticiasList();
    const noticia = noticias[idNum] ?? null;
    return { noticia, error: !noticia };
  } catch {
    return { noticia: null, error: true };
  }
};
