import { PUBLIC_NOTICIAS_API_URL } from '$env/static/public';
import type { DigestData, NoticiaItem } from '$lib/types/noticias';

/** Cache por proceso (build/prerender) para que `entries` y cada `load` compartan la misma respuesta. */
let cached: NoticiaItem[] | null = null;

export async function getNoticiasList(): Promise<NoticiaItem[]> {
  if (cached) return cached;
  const res = await fetch(PUBLIC_NOTICIAS_API_URL, { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Noticias API ${res.status}`);
  const json = (await res.json()) as DigestData;
  cached = Array.isArray(json?.noticias) ? json.noticias : [];
  return cached;
}
