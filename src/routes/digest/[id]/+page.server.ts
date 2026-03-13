import { NOTICIAS_API_URL } from '$env/static/private';
import type { NoticiaItem } from '../+page.server';

export async function load({ params }) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id) || id < 0) {
    return { noticia: null, error: true };
  }
  try {
    const res = await fetch(NOTICIAS_API_URL, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return { noticia: null, error: true };
    const json = await res.json();
    const noticias: NoticiaItem[] = json?.noticias ?? [];
    const noticia = noticias[id] ?? null;
    return { noticia, error: !noticia };
  } catch {
    return { noticia: null, error: true };
  }
}
