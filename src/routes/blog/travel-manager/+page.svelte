<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';
  import SectionLabel from '$lib/components/shared/SectionLabel.svelte';
  import NetworkParticlesBg from '$lib/components/quienes-somos/NetworkParticlesBg.svelte';

  let { data }: { data: PageData } = $props();

  let isLight = $state(false);
  let NetworkParticlesCmp = $state<typeof NetworkParticlesBg | null>(null);
  const digest = $derived(data.digest);
  const error = $derived(data.error);
  const featured = $derived(digest?.noticias?.[0]);

  const lightBg = 'bg-white/65 backdrop-blur-[2px]';
  const lightAltBg = 'bg-gray-50/65 backdrop-blur-[2px]';
  const darkBg = 'bg-[#060d1a]/72 backdrop-blur-[2px]';
  const darkAltBg = 'bg-[#08111e]/72 backdrop-blur-[2px]';
  function sectionBg(light: boolean, alt = false) {
    return light ? (alt ? lightAltBg : lightBg) : alt ? darkAltBg : darkBg;
  }

  function metaLabel(): string {
    return digest?.semana ? digest.semana : 'Travel Manager';
  }

  onMount(() => {
    isLight = document.documentElement.classList.contains('light');
    const handler = () => {
      isLight = document.documentElement.classList.contains('light');
    };
    window.addEventListener('themechange', handler);
    import('$lib/components/quienes-somos/NetworkParticlesBg.svelte').then((mod) => {
      NetworkParticlesCmp = mod.default;
    });
    return () => window.removeEventListener('themechange', handler);
  });
</script>

{#if NetworkParticlesCmp}
  <NetworkParticlesCmp {isLight} />
{/if}

<div class="relative min-h-screen z-10 transition-colors duration-500">
  <section class="section-divider relative flex flex-col items-center justify-center pt-28 pb-16 px-4 text-center overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="absolute top-1/4 -left-48 w-[400px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-magenta' : 'bg-azul'}"></div>
    <div class="absolute bottom-1/4 -right-48 w-[400px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-yellow' : 'bg-blue-900'}"></div>

    <FadeIn delay={0.1} className="relative z-10 mb-6">
      <SectionLabel text="Travel Manager" {isLight} />
    </FadeIn>
    <FadeIn delay={0.2}>
      <h1 class="relative z-10 text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight max-w-4xl transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
        Blog <span class="gradient-text-animate">Travel Manager</span>
      </h1>
    </FadeIn>
    <FadeIn delay={0.3}>
      <p class="relative z-10 mt-4 text-lg sm:text-xl max-w-2xl transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-300'}">
        Novedades de IA para travel managers y organizadores de eventos
      </p>
    </FadeIn>
    {#if digest?.semana && !error}
      <FadeIn delay={0.4}>
        <p class="relative z-10 mt-2 text-sm font-medium transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Semana del reporte: {digest.semana}
        </p>
      </FadeIn>
    {/if}
  </section>

  <section class="section-divider relative py-16 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-7xl mx-auto relative z-10">
      {#if error || !digest?.noticias?.length}
        <FadeIn delay={0.1}>
          <div class="text-center py-16 rounded-2xl border transition-colors duration-500 {isLight ? 'shadow-card-light shadow-card-light-hover border-gray-100 bg-white/90 text-gray-600 backdrop-blur-sm' : 'border-white/10 bg-[#0d1829]/80 text-gray-300 backdrop-blur-sm'}">
            <p class="text-lg font-medium">Próxima edición de Travel Manager en camino</p>
            <p class="mt-2 text-sm opacity-80">Vuelve pronto para ver el siguiente resumen.</p>
          </div>
        </FadeIn>
      {:else}
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div class="space-y-8">
            {#if featured}
              <FadeIn delay={0.1}>
                <a
                  href="/blog/travel-manager/0"
                  class="group block overflow-hidden rounded-sm transition-all duration-300 hover:-translate-y-0.5 micro-active-press {isLight ? 'bg-white shadow-card-light shadow-card-light-hover' : 'bg-[#0d1829]/90 shadow-lg shadow-black/20'}"
                >
                  <div class="relative min-h-[220px] sm:min-h-[300px] overflow-hidden bg-gradient-to-br from-[#e21717] via-[#b90f12] to-[#6f0b0d]">
                    <div class="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_25%_20%,white,transparent_28%),radial-gradient(circle_at_75%_80%,white,transparent_22%)]"></div>
                    <div class="absolute inset-x-0 top-0 h-12 bg-[#e21717]"></div>
                    <div class="absolute left-6 top-5 rounded bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#e21717]">
                      Externia
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center px-6 text-center">
                      <p class="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white/85 drop-shadow-lg">
                        Travel Manager
                      </p>
                    </div>
                  </div>
                  <div class="p-5 sm:p-6 text-left">
                    <h2 class="text-3xl sm:text-4xl font-black leading-tight transition-colors duration-300 {isLight ? 'text-gray-950 group-hover:text-[#e21717]' : 'text-white group-hover:text-blue-300'}">
                      {featured.titulo || 'Sin título'}
                    </h2>
                    <div class="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium {isLight ? 'text-gray-500' : 'text-gray-400'}">
                      <span class="inline-flex items-center gap-1">▣ {metaLabel()}</span>
                      <span class="inline-flex items-center gap-1">● Lectura rápida</span>
                    </div>
                    <p class="mt-4 max-w-3xl text-base leading-relaxed line-clamp-2 {isLight ? 'text-gray-600' : 'text-gray-300'}">
                      {featured.resumen || 'Sin resumen.'}
                    </p>
                  </div>
                </a>
              </FadeIn>
            {/if}

            {#if digest.noticias.length > 1}
              <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {#each digest.noticias.slice(1, 4) as noticia, i}
                  <FadeIn delay={0.15 + 0.05 * i} className="h-full">
                    <a
                      href="/blog/travel-manager/{i + 1}"
                      class="group block h-full transition-all duration-300 hover:-translate-y-1 micro-active-press"
                    >
                      <div class="relative h-28 overflow-hidden rounded-sm bg-gradient-to-br from-[#e21717] via-[#cb1014] to-[#7b090b]">
                        <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,white,transparent_26%)]"></div>
                        <div class="absolute left-4 top-4 rounded bg-white px-2 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#e21717]">
                          Travel
                        </div>
                        <p class="absolute bottom-3 left-4 right-4 text-xl font-black uppercase leading-none text-white drop-shadow">
                          Manager
                        </p>
                      </div>
                      <div class="pt-3 text-left">
                        <h3 class="text-lg font-black leading-tight transition-colors duration-300 {isLight ? 'text-gray-950 group-hover:text-[#e21717]' : 'text-white group-hover:text-blue-300'}">
                          {noticia.titulo || 'Sin título'}
                        </h3>
                        <div class="mt-2 space-y-1 text-xs font-medium {isLight ? 'text-gray-500' : 'text-gray-400'}">
                          <p>▣ {metaLabel()}</p>
                          <p>● Online</p>
                        </div>
                        <p class="mt-2 text-sm line-clamp-2 {isLight ? 'text-gray-600' : 'text-gray-300'}">
                          {noticia.resumen || 'Sin resumen.'}
                        </p>
                      </div>
                    </a>
                  </FadeIn>
                {/each}
              </div>
            {/if}
          </div>

          <aside class="space-y-5">
            <FadeIn delay={0.2}>
              <div class="rounded-sm border p-5 {isLight ? 'border-gray-100 bg-white shadow-card-light' : 'border-white/10 bg-[#0d1829]/85'}">
                <h2 class="text-xl font-black {isLight ? 'text-gray-950' : 'text-white'}">Noticias destacadas</h2>
                <div class="mt-5 divide-y {isLight ? 'divide-gray-100' : 'divide-white/10'}">
                  {#each digest.noticias.slice(1, 5) as noticia, i}
                    <a href="/blog/travel-manager/{i + 1}" class="group flex gap-4 py-4 first:pt-0 last:pb-0 micro-active-press">
                      <div class="h-[70px] w-[70px] shrink-0 rounded-sm bg-gradient-to-br from-[#e21717] to-[#8c0b0e]"></div>
                      <div class="min-w-0 text-left">
                        <h3 class="text-sm font-black leading-snug line-clamp-2 transition-colors duration-300 {isLight ? 'text-gray-950 group-hover:text-[#e21717]' : 'text-white group-hover:text-blue-300'}">
                          {noticia.titulo || 'Sin título'}
                        </h3>
                        <p class="mt-1 text-xs line-clamp-2 {isLight ? 'text-gray-500' : 'text-gray-400'}">
                          {noticia.resumen || 'Sin resumen.'}
                        </p>
                      </div>
                    </a>
                  {/each}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <div class="rounded-sm border p-5 {isLight ? 'border-gray-100 bg-white shadow-card-light' : 'border-white/10 bg-[#0d1829]/85'}">
                <div class="flex items-center gap-4">
                  <div class="flex h-[70px] w-[70px] items-center justify-center rounded-sm bg-[#e21717] text-sm font-black uppercase text-white">
                    TM
                  </div>
                  <div class="text-left">
                    <p class="text-xs font-black uppercase tracking-[0.16em] {isLight ? 'text-[#e21717]' : 'text-blue-300'}">Blog</p>
                    <h3 class="text-lg font-black {isLight ? 'text-gray-950' : 'text-white'}">Travel Manager</h3>
                  </div>
                </div>
              </div>
            </FadeIn>
          </aside>
        </div>
      {/if}
    </div>
  </section>
</div>
