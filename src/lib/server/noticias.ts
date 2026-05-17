import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import type { DigestData, NoticiaItem } from '$lib/types/noticias';

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedDigest: { expiresAt: number; value: DigestData } | null = null;

function getNoticiasApiUrl(): string {
  const apiUrl = privateEnv.NOTICIAS_API_URL || publicEnv.PUBLIC_NOTICIAS_API_URL;

  if (!apiUrl) {
    throw new Error('NOTICIAS_API_URL no configurada');
  }

  return apiUrl;
}

function normalizeDigest(data: Partial<DigestData> | null | undefined): DigestData {
  return {
    semana: typeof data?.semana === 'string' ? data.semana : '',
    noticias: Array.isArray(data?.noticias) ? data.noticias : []
  };
}

export async function getNoticiasDigest(fetchImpl: typeof fetch = fetch): Promise<DigestData> {
  const now = Date.now();

  if (cachedDigest && cachedDigest.expiresAt > now) {
    return cachedDigest.value;
  }

  const response = await fetchImpl(getNoticiasApiUrl(), {
    signal: AbortSignal.timeout(10000)
  });

  if (!response.ok) {
    throw new Error(`Noticias API ${response.status}`);
  }

  const digest = normalizeDigest((await response.json()) as DigestData);

  cachedDigest = {
    value: digest,
    expiresAt: now + CACHE_TTL_MS
  };

  return digest;
}

export async function getNoticiasList(fetchImpl: typeof fetch = fetch): Promise<NoticiaItem[]> {
  const digest = await getNoticiasDigest(fetchImpl);
  return digest.noticias;
}

export async function getNoticiaById(
  id: number,
  fetchImpl: typeof fetch = fetch
): Promise<NoticiaItem | null> {
  const noticias = await getNoticiasList(fetchImpl);
  return noticias[id] ?? null;
}
