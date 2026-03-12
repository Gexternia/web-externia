import type { NoticiaItem } from '../+page.server';

const API_URL = 'https://newsletters-8ko7.onrender.com/api/noticias';

export async function load({ params }) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id) || id < 0) {
    return { noticia: null, error: true };
  }
  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return { noticia: null, error: true };
    const json = await res.json();
    const noticias: NoticiaItem[] = json?.noticias ?? [];
    const noticia = noticias[id] ?? null;
    return { noticia, error: !noticia };
  } catch {
    return { noticia: null, error: true };
  }
}
