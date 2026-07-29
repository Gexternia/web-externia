<script lang="ts">
  import type { PageData } from './$types';
  import AegveHeader from '$lib/components/travel-manager/AegveHeader.svelte';

  let { data }: { data: PageData } = $props();

  const digest = $derived(data.digest);
  const error = $derived(data.error);
  const featured = $derived(digest?.noticias?.[0]);

  function formatDateLabel(): string {
    if (digest?.semana) {
      return digest.semana;
    }
    return new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>Noticias & Travel Manager — AEGVE</title>
  <meta name="description" content="Novedades, jornadas y publicaciones para Travel Managers y organizadores de eventos." />
</svelte:head>

<div class="min-h-screen bg-white text-gray-900 font-sans">
  <AegveHeader />

  <main class="max-w-7xl mx-auto px-4 py-8">
    <!-- Section Title Banner -->
    <div class="border-b-2 border-gray-100 pb-3 mb-8">
      <h1 class="text-xl sm:text-2xl font-black uppercase tracking-wider text-gray-900">
        Jornadas y Eventos
      </h1>
    </div>

    {#if error || !digest?.noticias?.length}
      <div class="text-center py-16 px-4 bg-gray-50 border border-gray-200 rounded-sm">
        <p class="text-lg font-bold text-gray-800">Próxima edición de Travel Manager en camino</p>
        <p class="mt-2 text-sm text-gray-500">Vuelve pronto para consultar las últimas novedades y eventos.</p>
      </div>
    {:else}
      <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        
        <!-- Left Main Content Column -->
        <div class="space-y-10">
          
          <!-- Main Featured Card -->
          {#if featured}
            <article class="group">
              <a href="/blog/travel-manager/0" class="block">
                <!-- Main Image Banner (Only colaboradores-eventos.png image) -->
                <div class="relative w-full h-[260px] sm:h-[360px] bg-[#d6001c] flex items-center justify-center overflow-hidden">
                  <img
                    src="/colaboradores-eventos.png"
                    alt="AEGVE Colaboradores"
                    class="w-full h-full object-cover object-center"
                  />
                  <div class="absolute top-4 left-4 bg-white text-[#d6001c] text-[10px] font-black uppercase tracking-wider px-3 py-1 z-10">
                    Travel Manager
                  </div>
                </div>

                <!-- Featured Text Content -->
                <div class="pt-5">
                  <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-950 group-hover:text-[#d6001c] transition-colors leading-tight">
                    {featured.titulo || 'Reunión online con socios colaboradores'}
                  </h2>

                  <div class="flex items-center gap-2 mt-3 text-xs text-gray-500 font-medium">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDateLabel()}</span>
                  </div>

                  {#if featured.resumen}
                    <p class="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {featured.resumen}
                    </p>
                  {/if}
                </div>
              </a>
            </article>
          {/if}

          <!-- 3-Column Secondary Cards Grid -->
          {#if digest.noticias.length > 1}
            <div class="grid gap-6 sm:grid-cols-3 pt-4 border-t border-gray-100">
              {#each digest.noticias.slice(1, 4) as noticia, i}
                <article class="group flex flex-col">
                  <a href="/blog/travel-manager/{i + 1}" class="block flex-1">
                    <!-- Thumbnail Banner (Only colaboradores-eventos.png image) -->
                    <div class="relative h-36 bg-[#d6001c] overflow-hidden">
                      <img
                        src="/colaboradores-eventos.png"
                        alt="Jornada AEGVE"
                        class="w-full h-full object-cover object-center"
                      />
                    </div>

                    <!-- Title & Date -->
                    <div class="pt-3">
                      <h3 class="text-base font-bold text-gray-900 group-hover:text-[#d6001c] transition-colors leading-snug line-clamp-2">
                        {noticia.titulo || 'Jornada AEGVE'}
                      </h3>
                      <div class="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDateLabel()}</span>
                      </div>
                    </div>
                  </a>
                </article>
              {/each}
            </div>
          {/if}

        </div>

        <!-- Right Sidebar -->
        <aside class="space-y-6">
          
          <!-- Card 1 -->
          {#if digest?.noticias?.[1]}
            <div class="border-b border-gray-200 pb-5">
              <a href="/blog/travel-manager/1" class="group flex items-start gap-4">
                <div class="w-24 h-20 shrink-0 bg-[#d6001c] flex items-center justify-center p-2">
                  <img src="/logo-aegve.png" alt="AEGVE" class="h-6 w-auto object-contain" />
                </div>
                <div>
                  <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Publicaciones</span>
                  <h3 class="text-sm font-bold text-gray-900 group-hover:text-[#d6001c] transition-colors leading-snug mt-1">
                    {digest.noticias[1].titulo}
                  </h3>
                </div>
              </a>
            </div>
          {/if}

          <!-- Card 2 -->
          {#if digest?.noticias?.[2]}
            <div class="border-b border-gray-200 pb-5">
              <a href="/blog/travel-manager/2" class="group flex items-start gap-4">
                <div class="w-24 h-20 shrink-0 bg-[#d6001c] flex items-center justify-center p-2">
                  <img src="/logo-aegve.png" alt="AEGVE" class="h-6 w-auto object-contain" />
                </div>
                <div class="flex-1">
                  <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Publicaciones</span>
                  <h3 class="text-sm font-bold text-gray-900 group-hover:text-[#d6001c] transition-colors leading-snug mt-0.5">
                    {digest.noticias[2].titulo}
                  </h3>
                </div>
              </a>
            </div>
          {/if}

          <!-- Card 3 -->
          {#if digest?.noticias?.[3]}
            <div class="border-b border-gray-200 pb-5">
              <a href="/blog/travel-manager/3" class="group flex items-start gap-4">
                <div class="w-24 h-20 shrink-0 bg-[#d6001c] flex items-center justify-center p-2">
                  <img src="/logo-aegve.png" alt="AEGVE" class="h-6 w-auto object-contain" />
                </div>
                <div>
                  <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Publicaciones</span>
                  <h3 class="text-sm font-bold text-gray-900 group-hover:text-[#d6001c] transition-colors leading-snug mt-1">
                    {digest.noticias[3].titulo}
                  </h3>
                </div>
              </a>
            </div>
          {/if}

          <!-- Quiénes somos AEGVE Card -->
          <div class="border-b border-gray-200 pb-5">
            <a href="https://aegve.es/nosotros/quienes-somos/" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-4">
              <div class="w-24 h-16 shrink-0 bg-[#d6001c] text-white flex items-center justify-center p-2">
                <img src="/logo-aegve.png" alt="AEGVE" class="h-6 w-auto object-contain" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900 group-hover:text-[#d6001c] transition-colors">
                  Quiénes somos
                </h3>
              </div>
            </a>
          </div>

          <!-- Chester AEGVE Card -->
          <div>
            <a href="https://aegve.es/category/chester/" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-4">
              <div class="w-24 h-14 shrink-0 bg-[#d6001c] text-white flex items-center justify-center p-2">
                <span class="text-xs font-black uppercase text-white">Chester AEGVE</span>
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900 group-hover:text-[#d6001c] transition-colors">
                  Chester AEGVE
                </h3>
              </div>
            </a>
          </div>

        </aside>

      </div>
    {/if}
  </main>
</div>
