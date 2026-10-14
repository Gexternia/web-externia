<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import NewsRadar from '$lib/components/story/NewsRadar.svelte';
  import GenCover from '$lib/components/story/GenCover.svelte';
  import CtaClose from '$lib/components/story/CtaClose.svelte';
  import { reveal } from '$lib/components/story/reveal';
  import '$lib/components/story/story.css';

  let { data }: { data: PageData } = $props();

  const digest = $derived(data.digest);
  const noticias = $derived(data.error ? [] : (digest?.noticias ?? []));
  const semana = $derived(!data.error && digest?.semana ? digest.semana : '');
  const num = (i: number) => String(i + 1).padStart(2, '0');

  let ready = $state(false);
  onMount(() => requestAnimationFrame(() => (ready = true)));
</script>

<section class="xs mast" class:ready>
  <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i><span class="grid"></span></div>
  <div class="xs-wrap grid2">
    <div class="copy">
      <span class="kick">AI Insight Digest · Blog de Externia</span>
      <h1>El radar de la IA <em>para eventos.</em></h1>
      <p class="lead">Cada semana detectamos las novedades de inteligencia artificial que importan y te contamos cómo aplicarlas en tu próximo evento.</p>
      {#if semana}<p class="week">{semana}</p>{/if}
      {#if noticias.length}
        <a class="xs-btn" href="#noticias">Ver las {noticias.length} novedades <span aria-hidden="true">↓</span></a>
      {/if}
    </div>
    <div class="radar-col">
      {#if noticias.length}
        <NewsRadar items={noticias} {semana} />
      {:else}
        <NewsRadar items={[]} />
      {/if}
    </div>
  </div>
</section>

<section class="xs xs-section feed" id="noticias" aria-label="Noticias de la semana">
  <div class="xs-wrap">
    {#if !noticias.length}
      <div class="empty" data-rv use:reveal>
        <h2>Próxima edición en camino.</h2>
        <p>El radar está escaneando las novedades de esta semana. Vuelve pronto.</p>
      </div>
    {:else}
      <div class="covers">
        {#each noticias as n, i}
          <a class="card" class:lead-card={i === 0} href="/blog/{i}" data-rv use:reveal style="--d: {(i % 3) * 80}ms">
            <GenCover seed={n.titulo || String(i)} num={num(i)} />
            <div class="body">
              {#if i === 0}<span class="tag">Destacada de la semana</span>{/if}
              <h3>{n.titulo || 'Sin título'}</h3>
              <p>{n.resumen || 'Sin resumen.'}</p>
              <span class="go">Cómo aplicarlo <span aria-hidden="true">→</span></span>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<CtaClose
  title="¿Quieres llevar esto a tu evento?"
  accent="evento?"
  text="Te ayudamos a convertir cada novedad en una experiencia real para tus asistentes."
  label="Hablemos"
/>

<style>
  /* ---------- masthead + radar ---------- */
  .mast { min-height: 100vh; min-height: 100svh; display: flex; align-items: center; padding: calc(90px + 4vh) 0 8vh; overflow: hidden; }
  .grid2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 80px); align-items: center; }
  .kick { font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--xs-pink-2); }
  h1 { margin: 16px 0 0; font-size: clamp(46px, 6.4vw, 104px); font-weight: 800; line-height: 0.94; letter-spacing: -0.045em; text-wrap: balance; }
  h1 em { font-style: normal; color: var(--xs-pink-2); }
  .lead { margin: 26px 0 0; max-width: 46ch; font-size: clamp(17px, 1.4vw, 21px); line-height: 1.6; color: var(--xs-muted); }
  .week { margin: 18px 0 0; font-size: 14px; font-weight: 700; }
  .copy .xs-btn { margin-top: 30px; }
  .copy > * { transform: translateY(18px); transition: transform 1s var(--xs-ease); }
  .ready .copy > * { transform: none; }
  .radar-col { opacity: 0; transform: scale(0.9) rotate(-8deg); transition: opacity 1s ease 0.2s, transform 1.4s var(--xs-ease) 0.2s; }
  .ready .radar-col { opacity: 1; transform: none; }

  /* ---------- generative covers ---------- */
  .covers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(16px, 2vw, 28px); }
  .card { display: flex; flex-direction: column; border-radius: 24px; overflow: hidden; background: var(--xs-card); color: var(--xs-ink); text-decoration: none; box-shadow: inset 0 0 0 1px var(--xs-line); transition: transform 0.6s var(--xs-ease), box-shadow 0.4s; }
  .card:hover { transform: translateY(-6px); box-shadow: inset 0 0 0 1.5px var(--xs-pink), 0 40px 70px -40px rgba(214, 0, 125, 0.55); }
  .card :global(.cover) { border-radius: 0; }
  .body { display: flex; flex-direction: column; gap: 10px; padding: clamp(18px, 2vw, 26px); flex: 1; }
  .tag { font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--xs-pink-2); }
  .card h3 { margin: 0; font-size: clamp(19px, 1.6vw, 24px); font-weight: 800; line-height: 1.15; letter-spacing: -0.02em; }
  .card p { margin: 0; font-size: 15px; line-height: 1.55; color: var(--xs-muted); display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .go { margin-top: auto; padding-top: 6px; font-size: 15px; font-weight: 800; display: inline-flex; gap: 8px; transition: gap 0.3s var(--xs-ease); }
  .card:hover .go { gap: 14px; color: var(--xs-pink-2); }

  /* the featured story spans two columns, cover on the side */
  .lead-card { grid-column: 1 / -1; flex-direction: row; }
  .lead-card :global(.cover) { width: 48%; flex: none; aspect-ratio: 16 / 10; }
  .lead-card .body { justify-content: center; padding: clamp(24px, 3vw, 44px); }
  .lead-card h3 { font-size: clamp(28px, 3vw, 46px); line-height: 1.04; letter-spacing: -0.035em; }
  .lead-card p { -webkit-line-clamp: 5; line-clamp: 5; font-size: 17px; max-width: 56ch; }

  .empty { text-align: center; padding: clamp(48px, 10vh, 96px) 16px; border-radius: 28px; background: var(--xs-card); box-shadow: inset 0 0 0 1px var(--xs-line); }
  .empty h2 { margin: 0; font-size: clamp(28px, 3vw, 44px); font-weight: 800; letter-spacing: -0.03em; }
  .empty p { margin: 12px 0 0; color: var(--xs-muted); }

  @media (max-width: 1000px) {
    .covers { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 900px) {
    .grid2 { grid-template-columns: 1fr; }
    .radar-col { order: -1; max-width: 420px; justify-self: center; width: 100%; }
    .mast { min-height: 0; }
  }
  @media (max-width: 760px) {
    .lead-card { flex-direction: column; }
  }
  @media (max-width: 640px) {
    .covers { grid-template-columns: 1fr; }
    .lead-card { grid-column: auto; flex-direction: column; }
    .lead-card :global(.cover) { width: 100%; aspect-ratio: 4 / 3; }
  }
</style>
