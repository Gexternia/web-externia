<script lang="ts">
  import { onMount } from 'svelte';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';
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
  <title>{pageData.noticia?.titulo ?? 'Noticia'} — AI Digest | Externia</title>
  <meta name="description" content={pageData.noticia?.resumen ?? 'Detalle de noticia del AI Insight Digest.'} />
</svelte:head>

{#if NetworkParticlesCmp}
  <NetworkParticlesCmp {isLight} />
{/if}

<div class="relative min-h-screen z-10 transition-colors duration-500">
  {#if pageData.error || !pageData.noticia}
    <section class="section-divider relative flex flex-col items-center justify-center py-28 px-4 text-center transition-colors duration-500 {sectionBg(isLight)}">
      <FadeIn delay={0.1}>
        <h1 class="text-2xl font-bold transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">Noticia no encontrada</h1>
        <a
          href="/digest"
          class="mt-6 inline-block px-6 py-3 rounded-xl font-semibold transition-all duration-300 {isLight
            ? 'bg-brand-magenta text-white hover:bg-brand-fuchsia'
            : 'bg-azul text-white hover:bg-blue-600'}"
        >
          Volver al digest
        </a>
      </FadeIn>
    </section>
  {:else}
    {@const n = pageData.noticia}
    <section class="section-divider relative py-20 px-4 transition-colors duration-500 {sectionBg(isLight)}">
      <div class="max-w-3xl mx-auto">
        <FadeIn delay={0.1}>
          <a
            href="/digest"
            class="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-azul hover:text-blue-300'}"
          >
            ← Volver al digest
          </a>
        </FadeIn>

        <FadeIn delay={0.15}>
          <h1 class="mt-6 text-3xl sm:text-4xl font-black leading-tight tracking-tight transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
            {n.titulo || 'Sin título'}
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p class="mt-6 text-lg leading-relaxed transition-colors duration-500 {isLight ? 'text-gray-600' : 'text-gray-300'}">
            {n.resumen || 'Sin resumen.'}
          </p>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div class="mt-10 rounded-2xl border p-6 transition-colors duration-500 {isLight ? 'border-gray-200 bg-gray-50/80' : 'border-white/10 bg-white/5'}">
            <h2 class="text-lg font-bold transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
              ¿Cómo usar esta novedad en tu evento?
            </h2>
            <dl class="mt-4 space-y-3">
              {#if n.relevancia_eventos}
                <div>
                  <dt class="text-xs font-semibold uppercase tracking-wider transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">Relevancia para eventos</dt>
                  <dd class="mt-1 transition-colors duration-500 {isLight ? 'text-gray-700' : 'text-gray-300'}">{n.relevancia_eventos}</dd>
                </div>
              {/if}
              {#if n.formato_actividad}
                <div>
                  <dt class="text-xs font-semibold uppercase tracking-wider transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">Formato de actividad</dt>
                  <dd class="mt-1 transition-colors duration-500 {isLight ? 'text-gray-700' : 'text-gray-300'}">{n.formato_actividad}</dd>
                </div>
              {/if}
              {#if n.tipo_speaker}
                <div>
                  <dt class="text-xs font-semibold uppercase tracking-wider transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">Tipo de speaker</dt>
                  <dd class="mt-1 transition-colors duration-500 {isLight ? 'text-gray-700' : 'text-gray-300'}">{n.tipo_speaker}</dd>
                </div>
              {/if}
              {#if n.audiencia}
                <div>
                  <dt class="text-xs font-semibold uppercase tracking-wider transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">Audiencia</dt>
                  <dd class="mt-1 transition-colors duration-500 {isLight ? 'text-gray-700' : 'text-gray-300'}">{n.audiencia}</dd>
                </div>
              {/if}
            </dl>
          </div>
        </FadeIn>

        {#if n.url?.trim()}
          <FadeIn delay={0.3}>
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              class="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 {isLight
                ? 'bg-brand-magenta text-white hover:bg-brand-fuchsia'
                : 'bg-azul text-white hover:bg-blue-600'}"
            >
              Leer noticia original
              <span aria-hidden="true">→</span>
            </a>
          </FadeIn>
        {/if}
      </div>
    </section>
  {/if}
</div>
