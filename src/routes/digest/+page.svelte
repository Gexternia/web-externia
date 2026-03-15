<script lang="ts">
  import { onMount } from 'svelte';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';
  import SectionLabel from '$lib/components/shared/SectionLabel.svelte';
  import NetworkParticlesBg from '$lib/components/quienes-somos/NetworkParticlesBg.svelte';
  import type { PageData } from './$types';

  let { data: pageData }: { data: PageData } = $props();

  let isLight = $state(false);
  let NetworkParticlesCmp = $state<typeof NetworkParticlesBg | null>(null);

  const lightBg = 'bg-white/65 backdrop-blur-[2px]';
  const lightAltBg = 'bg-gray-50/65 backdrop-blur-[2px]';
  const darkBg = 'bg-[#060d1a]/72 backdrop-blur-[2px]';
  const darkAltBg = 'bg-[#08111e]/72 backdrop-blur-[2px]';
  function sectionBg(light: boolean, alt = false) {
    return light ? (alt ? lightAltBg : lightBg) : alt ? darkAltBg : darkBg;
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

<svelte:head>
  <title>Blog de Inteligencia Artificial — Externia AI for Events</title>
  <meta name="description" content="Novedades de IA para el sector eventos. Resumen semanal." />
</svelte:head>

{#if NetworkParticlesCmp}
  <NetworkParticlesCmp {isLight} />
{/if}

<div class="relative min-h-screen z-10 transition-colors duration-500">
  <section class="section-divider relative flex flex-col items-center justify-center py-28 px-4 text-center overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="absolute top-1/4 -left-48 w-[400px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-magenta' : 'bg-azul'}"></div>
    <div class="absolute bottom-1/4 -right-48 w-[400px] h-[400px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-yellow' : 'bg-blue-900'}"></div>

    <FadeIn delay={0.1} className="relative z-10 mb-6">
      <SectionLabel text="Newsletter" {isLight} />
    </FadeIn>
    <FadeIn delay={0.2}>
      <h1 class="relative z-10 text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight max-w-4xl transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
        Blog de Inteligencia <span class="gradient-text-animate">Artificial</span>
      </h1>
    </FadeIn>
    <FadeIn delay={0.3}>
      <p class="relative z-10 mt-4 text-lg sm:text-xl max-w-2xl transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-300'}">
        Novedades de IA para el sector eventos
      </p>
    </FadeIn>
    {#if pageData.data?.semana && !pageData.error}
      <FadeIn delay={0.4}>
        <p class="relative z-10 mt-2 text-sm font-medium transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Semana del reporte: {pageData.data.semana}
        </p>
      </FadeIn>
    {/if}
  </section>

  <section class="section-divider relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-6xl mx-auto relative z-10">
      {#if pageData.error || !pageData.data?.noticias?.length}
        <FadeIn delay={0.1}>
          <div class="text-center py-16 rounded-2xl border transition-colors duration-500 {isLight ? 'shadow-card-light shadow-card-light-hover border-gray-100 bg-white/90 text-gray-600 backdrop-blur-sm' : 'border-white/10 bg-[#0d1829]/80 text-gray-300 backdrop-blur-sm'}">
            <p class="text-lg font-medium">Próxima edición en camino</p>
            <p class="mt-2 text-sm opacity-80">Vuelve pronto para ver el siguiente resumen.</p>
          </div>
        </FadeIn>
      {:else}
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each pageData.data.noticias as noticia, i}
            <FadeIn delay={0.05 * i} className="h-full">
              <a
                href="/digest/{i}"
                class="block h-full rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 micro-active-press {isLight
                  ? 'shadow-card-light shadow-card-light-hover border-gray-100 bg-gradient-to-br from-[#DE3B84]/10 via-white/95 to-[#FFC12D]/6 hover:border-brand-magenta/40 hover:shadow-card-light-hover backdrop-blur-sm'
                  : 'border-white/8 bg-gradient-to-br from-azul/10 via-[#0d1829]/90 to-blue-900/20 hover:border-azul/40 hover:shadow-lg hover:shadow-azul/10 backdrop-blur-sm'}"
              >
                <h3 class="text-lg font-bold leading-snug transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
                  {noticia.titulo || 'Sin título'}
                </h3>
                <p class="mt-3 text-sm line-clamp-3 transition-colors duration-500 {isLight ? 'text-gray-600' : 'text-gray-400'}">
                  {noticia.resumen || 'Sin resumen.'}
                </p>
                {#if noticia.formato_actividad}
                  <span
                    class="mt-4 inline-block px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-500 {isLight
                      ? 'bg-brand-magenta/15 text-brand-fuchsia'
                      : 'bg-azul/15 text-blue-300'}"
                  >
                    {noticia.formato_actividad}
                  </span>
                {/if}
              </a>
            </FadeIn>
          {/each}
        </div>
      {/if}
    </div>
  </section>
</div>
