import { NOTICIAS_API_URL } from '$env/static/private';

export interface NoticiaItem {
  titulo: string;
  resumen: string;
  url: string;
  relevancia_eventos: string;
  formato_actividad: string;
  tipo_speaker: string;
  audiencia: string;
}

export interface DigestData {
  semana: string;
  noticias: NoticiaItem[];
}

export async function load() {
  try {
    const res = await fetch(NOTICIAS_API_URL, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) throw new Error('API error');
    const data = (await res.json()) as DigestData;
    if (!data?.noticias || !Array.isArray(data.noticias)) {
      return { data: null, error: true };
    }
    return { data: { semana: data.semana ?? '', noticias: data.noticias }, error: false };
  } catch {
    return { data: null, error: true };
  }
}
