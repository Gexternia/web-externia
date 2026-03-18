<script lang="ts">
  import { onMount } from 'svelte';
  import { PUBLIC_NOTICIAS_API_URL } from '$env/static/public';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';
  import SectionLabel from '$lib/components/shared/SectionLabel.svelte';
  import NetworkParticlesBg from '$lib/components/quienes-somos/NetworkParticlesBg.svelte';
  import type { DigestData } from '$lib/types/noticias';

  let isLight = $state(false);
  let NetworkParticlesCmp = $state<typeof NetworkParticlesBg | null>(null);
  let data = $state<{ semana: string; noticias: DigestData['noticias'] } | null>(null);
  let error = $state(false);
  let loading = $state(true);

  const lightBg = 'bg-white/65 backdrop-blur-[2px]';
  const lightAltBg = 'bg-gray-50/65 backdrop-blur-[2px]';
  const darkBg = 'bg-[#060d1a]/72 backdrop-blur-[2px]';
  const darkAltBg = 'bg-[#08111e]/72 backdrop-blur-[2px]';
  function sectionBg(light: boolean, alt = false) {
    return light ? (alt ? lightAltBg : lightBg) : alt ? darkAltBg : darkBg;
  }

  async function fetchNoticias() {
    loading = true;
    error = false;
    data = null;
    try {
      const res = await fetch(PUBLIC_NOTICIAS_API_URL, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error('API error');
      const json = (await res.json()) as DigestData;
      if (!json?.noticias || !Array.isArray(json.noticias)) {
        error = true;
        return;
      }
      data = { semana: json.semana ?? '', noticias: json.noticias };
    } catch {
      error = true;
    } finally {
      loading = false;
    }
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
    fetchNoticias();
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
    {#if data?.semana && !error && !loading}
      <FadeIn delay={0.4}>
        <p class="relative z-10 mt-2 text-sm font-medium transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Semana del reporte: {data.semana}
        </p>
      </FadeIn>
    {/if}
  </section>

  <section class="section-divider relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-6xl mx-auto relative z-10">
      {#if loading}
        <FadeIn delay={0.1}>
          <div class="text-center py-16 rounded-2xl border transition-colors duration-500 {isLight ? 'shadow-card-light border-gray-100 bg-white/90 text-gray-600 backdrop-blur-sm' : 'border-white/10 bg-[#0d1829]/80 text-gray-300 backdrop-blur-sm'}">
            <p class="text-lg font-medium">Cargando noticias…</p>
          </div>
        </FadeIn>
      {:else if error || !data?.noticias?.length}
        <FadeIn delay={0.1}>
          <div class="text-center py-16 rounded-2xl border transition-colors duration-500 {isLight ? 'shadow-card-light shadow-card-light-hover border-gray-100 bg-white/90 text-gray-600 backdrop-blur-sm' : 'border-white/10 bg-[#0d1829]/80 text-gray-300 backdrop-blur-sm'}">
            <p class="text-lg font-medium">Próxima edición en camino</p>
            <p class="mt-2 text-sm opacity-80">Vuelve pronto para ver el siguiente resumen.</p>
          </div>
        </FadeIn>
      {:else}
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {#each data.noticias as noticia, i}
            <FadeIn delay={0.05 * i} className="h-full">
              <a
                href="/blog/{i}"
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
                <span
                  class="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-500 min-h-[40px] {isLight
                    ? 'bg-brand-magenta/20 text-brand-fuchsia hover:bg-brand-magenta/30'
                    : 'bg-azul/20 text-blue-300 hover:bg-azul/30'}"
                >
                  ver blog
                </span>
              </a>
            </FadeIn>
          {/each}
        </div>
      {/if}
    </div>
  </section>
</div>
