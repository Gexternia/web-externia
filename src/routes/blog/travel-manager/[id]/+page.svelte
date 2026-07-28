<script lang="ts">
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import AegveHeader from '$lib/components/travel-manager/AegveHeader.svelte';
  import {
    buildArticleSchema,
    buildBreadcrumbSchema,
    buildTravelManagerArticleBreadcrumbItems,
    toJsonLdString
  } from '$lib/seo/json-ld';
  import type { NoticiaItem } from '$lib/types/noticias';

  let { data }: { data: PageData } = $props();

  const noticia = $derived(data.noticia);
  const error = $derived(data.error);

  function hasVisibleText(value?: string): boolean {
    if (!value) return false;
    const cleaned = value.trim().replace(/\s+/g, ' ');
    return cleaned !== '' && cleaned !== '-' && cleaned !== '—' && cleaned !== '–';
  }

  function buildComoUsarDesc(n: NoticiaItem): string {
    const parts: string[] = [];
    if (hasVisibleText(n.relevancia_eventos)) parts.push(n.relevancia_eventos!);
    if (hasVisibleText(n.formato_actividad)) parts.push(n.formato_actividad!);
    if (hasVisibleText(n.tipo_speaker)) parts.push(n.tipo_speaker!);
    if (hasVisibleText(n.audiencia)) parts.push(n.audiencia!);
    return parts.join('. ') || 'Aplica esta novedad adaptándola a la estrategia de viajes y eventos de tu organización.';
  }

  const articleTitle = $derived(`${noticia?.titulo ?? 'Noticia'} — Travel Manager | AEGVE`);
  const articleDescription = $derived(
    noticia?.resumen ?? 'Detalle de noticia de Travel Manager.'
  );

  const origin = $derived($page.url.origin);
  const pathname = $derived($page.url.pathname);
  const jsonLdImage = $derived(`${origin}/externia-icon.svg`);

  const articleJsonLd = $derived(
    noticia && !error
      ? buildArticleSchema({
          origin,
          pathname,
          headline: noticia.titulo?.trim() || 'Sin título',
          description: noticia.resumen?.trim() || articleDescription,
          imageUrl: jsonLdImage
        })
      : null
  );

  const articleBreadcrumbJsonLd = $derived(
    noticia && !error
      ? buildBreadcrumbSchema(
          buildTravelManagerArticleBreadcrumbItems(
            origin,
            pathname,
            noticia.titulo?.trim() || 'Noticia'
          )
        )
      : null
  );

  const articleJsonLdTag = $derived(
    articleJsonLd && articleBreadcrumbJsonLd
      ? '<script type="application/ld+json">' +
          toJsonLdString(articleJsonLd) +
          '<\/script><script type="application/ld+json">' +
          toJsonLdString(articleBreadcrumbJsonLd) +
          '<\/script>'
      : ''
  );
</script>

<svelte:head>
  <title>{articleTitle}</title>
  <meta name="description" content={articleDescription} />
  <meta property="og:title" content={articleTitle} />
  <meta property="og:description" content={articleDescription} />
  <meta name="twitter:title" content={articleTitle} />
  <meta name="twitter:description" content={articleDescription} />
  {#if articleJsonLdTag}
    {@html articleJsonLdTag}
  {/if}
</svelte:head>

<div class="min-h-screen bg-white text-gray-900 font-sans">
  <AegveHeader />

  <main class="max-w-4xl mx-auto px-4 py-10">
    {#if error || !noticia}
      <div class="text-center py-16 px-4 bg-gray-50 border border-gray-200 rounded-sm">
        <h1 class="text-xl font-bold text-gray-900">Noticia no encontrada</h1>
        <p class="mt-2 text-sm text-gray-600">No se ha podido localizar la publicación solicitada.</p>
        <a
          href="/blog/travel-manager"
          class="mt-6 inline-block px-6 py-2.5 bg-[#d6001c] text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
        >
          Volver a Noticias AEGVE
        </a>
      </div>
    {:else}
      {@const n = noticia}

      <!-- Back Link -->
      <div class="mb-6">
        <a
          href="/blog/travel-manager"
          class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d6001c] hover:underline"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Noticias & Travel Manager
        </a>
      </div>

      <!-- Main Article Card / Header -->
      <article class="bg-white border border-gray-200 p-6 sm:p-10 shadow-sm">
        <div class="inline-block bg-[#d6001c] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-4">
          Travel Manager
        </div>

        <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-950 leading-tight">
          {n.titulo || 'Sin título'}
        </h1>

        <div class="mt-4 pb-6 border-b border-gray-100 text-xs font-medium text-gray-500 flex items-center gap-2">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Publicado en la sección Travel Manager de AEGVE</span>
        </div>

        <!-- Article Summary -->
        <div class="mt-6 text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
          <p>{n.resumen || 'Sin resumen.'}</p>
        </div>

        <!-- Practical Application Box (Clean Card without Emojis) -->
        <div class="mt-10 bg-red-50/70 border-l-4 border-[#d6001c] p-6 text-left">
          <div class="flex items-center gap-2 text-[#d6001c] font-black text-sm uppercase tracking-wider mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Aplicación práctica para Travel Managers</span>
          </div>
          <p class="text-sm text-gray-800 leading-relaxed font-medium">
            {buildComoUsarDesc(n)}
          </p>
        </div>

        <!-- Source Link Button -->
        {#if n.url?.trim()}
          <div class="mt-8 pt-6 border-t border-gray-100">
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3.5 bg-[#d6001c] text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-sm"
            >
              <span>Leer noticia en la fuente original</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        {/if}
      </article>
    {/if}
  </main>
</div>
