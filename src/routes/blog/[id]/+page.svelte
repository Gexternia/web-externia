<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { PUBLIC_NOTICIAS_API_URL } from '$env/static/public';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';
  import FlipCard from '$lib/components/quienes-somos/FlipCard.svelte';
  import NetworkParticlesBg from '$lib/components/quienes-somos/NetworkParticlesBg.svelte';
  import type { NoticiaItem } from '$lib/types/noticias';

  let isLight = $state(false);
  let NetworkParticlesCmp = $state<typeof NetworkParticlesBg | null>(null);
  let noticia = $state<NoticiaItem | null>(null);
  let error = $state(false);
  let loading = $state(true);
  let ctaHovered = $state(false);
  let primaryRef: HTMLSpanElement;
  let cloneRef: HTMLSpanElement;
  const TR = 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)';

  const id = $derived($page.params.id);
  const idNum = $derived(parseInt(id, 10));

  function onBtnEnter() {
    ctaHovered = true;
    if (!primaryRef || !cloneRef) return;
    primaryRef.style.transition = 'none';
    primaryRef.style.transform = 'translateX(0%)';
    cloneRef.style.transition = 'none';
    cloneRef.style.transform = 'translateX(-110%)';
    primaryRef.getBoundingClientRect();
    primaryRef.style.transition = TR;
    primaryRef.style.transform = 'translateX(110%)';
    cloneRef.style.transition = TR;
    cloneRef.style.transform = 'translateX(0%)';
  }

  function onBtnLeave() {
    ctaHovered = false;
    if (!primaryRef || !cloneRef) return;
    primaryRef.style.transition = 'none';
    primaryRef.style.transform = 'translateX(-110%)';
    cloneRef.style.transition = 'none';
    cloneRef.style.transform = 'translateX(0%)';
    cloneRef.getBoundingClientRect();
    cloneRef.style.transition = TR;
    cloneRef.style.transform = 'translateX(110%)';
    primaryRef.style.transition = TR;
    primaryRef.style.transform = 'translateX(0%)';
  }

  function buildComoUsarDesc(n: NoticiaItem): string {
    const parts: string[] = [];
    if (n.relevancia_eventos?.trim()) parts.push(`Relevancia para eventos: ${n.relevancia_eventos}`);
    if (n.formato_actividad?.trim()) parts.push(`Formato de actividad: ${n.formato_actividad}`);
    if (n.tipo_speaker?.trim()) parts.push(`Tipo de speaker: ${n.tipo_speaker}`);
    if (n.audiencia?.trim()) parts.push(`Audiencia: ${n.audiencia}`);
    return parts.join('. ') || 'Aplica esta novedad adaptándola a las necesidades concretas de tu evento.';
  }

  const lightBg = 'bg-white/65 backdrop-blur-[2px]';
  const lightAltBg = 'bg-gray-50/65 backdrop-blur-[2px]';
  const darkBg = 'bg-[#060d1a]/72 backdrop-blur-[2px]';
  const darkAltBg = 'bg-[#08111e]/72 backdrop-blur-[2px]';
  function sectionBg(light: boolean, alt = false) {
    return light ? (alt ? lightAltBg : lightBg) : alt ? darkAltBg : darkBg;
  }

  async function fetchNoticia() {
    if (Number.isNaN(idNum) || idNum < 0) {
      error = true;
      loading = false;
      noticia = null;
      return;
    }
    loading = true;
    error = false;
    noticia = null;
    try {
      const res = await fetch(PUBLIC_NOTICIAS_API_URL, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) {
        error = true;
        return;
      }
      const json = await res.json();
      const noticias: NoticiaItem[] = json?.noticias ?? [];
      noticia = noticias[idNum] ?? null;
      if (!noticia) error = true;
    } catch {
      error = true;
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    id;
    fetchNoticia();
  });

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
  <title>{noticia?.titulo ?? 'Noticia'} — Blog IA | Externia</title>
  <meta name="description" content={noticia?.resumen ?? 'Detalle de noticia del AI Insight Digest.'} />
</svelte:head>

{#if NetworkParticlesCmp}
  <NetworkParticlesCmp {isLight} />
{/if}

<div class="relative min-h-screen z-10 transition-colors duration-500">
  {#if loading}
    <section class="section-divider relative flex flex-col items-center justify-center py-28 px-4 text-center overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
      <FadeIn delay={0.1}>
        <p class="text-lg font-medium transition-colors duration-500 {isLight ? 'text-gray-600' : 'text-gray-300'}">Cargando…</p>
      </FadeIn>
    </section>
  {:else if error || !noticia}
    <section class="section-divider relative flex flex-col items-center justify-center py-28 px-4 text-center overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
      <FadeIn delay={0.1}>
        <h1 class="text-2xl font-bold transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">Noticia no encontrada</h1>
        <a
          href="/blog"
          class="mt-6 inline-block px-6 py-3 rounded-xl font-semibold transition-all duration-300 {isLight
            ? 'bg-brand-magenta text-white hover:bg-brand-fuchsia'
            : 'bg-azul text-white hover:bg-blue-600'}"
        >
          Volver al Blog
        </a>
      </FadeIn>
    </section>
  {:else}
    {@const n = noticia}
    <section class="section-divider relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
      <div class="max-w-3xl mx-auto relative z-10">
        <FadeIn delay={0.1}>
          <a
            href="/blog"
            class="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-azul hover:text-blue-300'}"
          >
            ← Volver al Blog
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

        <FadeIn delay={0.25} className="mt-10">
          <FlipCard
            icon="💡"
            title="¿Cómo usar esta novedad en tu evento?"
            desc={buildComoUsarDesc(n)}
            gradient="from-[#EE847B] to-[#DE3B84]"
            variant="large"
            {isLight}
          />
        </FadeIn>

        {#if n.url?.trim()}
          <FadeIn delay={0.3}>
            <a
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              class="btn-cta-animated micro-active-press relative inline-block overflow-hidden mt-8 px-10 py-4 rounded-full text-base font-bold text-white transition-all duration-300 hover:scale-105 {isLight
                ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia'
                : 'bg-azul'}"
              style={ctaHovered ? (isLight ? 'box-shadow: 0 0 50px #DE3B8490, 0 0 100px #D6007D40' : 'box-shadow: 0 0 50px #0070f390, 0 0 100px #0070f340') : ''}
              onmouseenter={onBtnEnter}
              onmouseleave={onBtnLeave}
            >
              <span class="invisible whitespace-nowrap">Leer noticia original →</span>
              <span bind:this={primaryRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(0%)">Leer noticia original →</span>
              <span bind:this={cloneRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(-110%)">Leer noticia original →</span>
            </a>
          </FadeIn>
        {/if}
      </div>
    </section>
  {/if}
</div>
