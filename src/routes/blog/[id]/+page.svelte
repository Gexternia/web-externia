<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import type { PageData } from './$types';
  import {
    buildArticleBreadcrumbItems,
    buildArticleSchema,
    buildBreadcrumbSchema,
    toJsonLdString
  } from '$lib/seo/json-ld';
  import { reveal } from '$lib/components/story/reveal';
  import GenCover from '$lib/components/story/GenCover.svelte';
  import '$lib/components/story/story.css';

  let { data }: { data: PageData } = $props();

  const noticia = $derived(data.noticia);
  const error = $derived(data.error);
  const num = (i: number) => String(i + 1).padStart(2, '0');

  function hasVisibleText(value?: string): boolean {
    if (!value) return false;
    const cleaned = value.trim().replace(/\s+/g, ' ');
    return cleaned !== '' && cleaned !== '-' && cleaned !== '—' && cleaned !== '–';
  }

  // "How to use it at your event", one block per field the digest provides
  const guide = $derived(
    noticia
      ? [
          { label: 'Relevancia para eventos', text: noticia.relevancia_eventos },
          { label: 'Formato de actividad', text: noticia.formato_actividad },
          { label: 'Tipo de speaker', text: noticia.tipo_speaker },
          { label: 'Audiencia', text: noticia.audiencia }
        ].filter((g) => hasVisibleText(g.text))
      : []
  );

  let ready = $state(false);
  onMount(() => requestAnimationFrame(() => (ready = true)));

  const articleTitle = $derived(`${noticia?.titulo ?? 'Noticia'} — Blog IA | Externia`);
  const articleDescription = $derived(noticia?.resumen ?? 'Detalle de noticia del AI Insight Digest.');

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
      ? buildBreadcrumbSchema(buildArticleBreadcrumbItems(origin, pathname, noticia.titulo?.trim() || 'Noticia'))
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

{#if error || !noticia}
  <section class="xs nf">
    <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><span class="grid"></span></div>
    <div class="xs-wrap">
      <h1>Noticia no encontrada.</h1>
      <p>Puede que la edición de esta semana ya haya cambiado.</p>
      <a class="xs-btn" href="/blog">Volver al blog <span aria-hidden="true">→</span></a>
    </div>
  </section>
{:else}
  {@const n = noticia}
  <article class="xs post" class:ready>
    <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i><span class="grid"></span></div>

    <header class="xs-wrap top">
      <a class="back" href="/blog"><span aria-hidden="true">←</span> Volver al blog</a>
      <div class="meta">
        <span class="badge">Noticia {num(data.id)}{#if data.total} / {String(data.total).padStart(2, '0')}{/if}</span>
        {#if data.semana}<span class="week">{data.semana}</span>{/if}
      </div>
      <h1>{n.titulo || 'Sin título'}</h1>
      <span class="xs-bar rule" aria-hidden="true"></span>
      <div class="banner"><GenCover seed={n.titulo || String(data.id)} num={num(data.id)} /></div>
      <p class="lead">{n.resumen || 'Sin resumen.'}</p>
    </header>

    <section class="xs-wrap how" aria-label="Cómo usar esta novedad en tu evento">
      <h2 class="how-t" data-rv use:reveal>¿Cómo usar esta novedad <em>en tu evento?</em></h2>
      {#if guide.length}
        <ol class="steps">
          {#each guide as g, i}
            <li data-rv use:reveal style="--d: {i * 80}ms">
              <span class="mk" aria-hidden="true"><i style="width: {i % 2 ? 68.75 : 100}%"></i></span>
              <div>
                <h3>{g.label}</h3>
                <p>{g.text}</p>
              </div>
            </li>
          {/each}
        </ol>
      {:else}
        <p class="fallback" data-rv use:reveal>Aplica esta novedad adaptándola a las necesidades concretas de tu evento.</p>
      {/if}

      <div class="actions" data-rv use:reveal>
        {#if n.url?.trim()}
          <a class="xs-btn" href={n.url} target="_blank" rel="noopener noreferrer">Leer noticia original <span aria-hidden="true">↗</span></a>
        {/if}
        <a class="xs-btn xs-btn--ghost" href="/contacto">Aplicarlo en mi evento</a>
      </div>
    </section>

    {#if data.prev || data.next}
      <nav class="xs-wrap pager" aria-label="Más noticias">
        {#if data.prev}
          <a class="pg prev" href="/blog/{data.prev.id}">
            <span class="dir">← Anterior · {num(data.prev.id)}</span>
            <span class="pt">{data.prev.titulo}</span>
          </a>
        {:else}<span></span>{/if}
        {#if data.next}
          <a class="pg next" href="/blog/{data.next.id}">
            <span class="dir">Siguiente · {num(data.next.id)} →</span>
            <span class="pt">{data.next.titulo}</span>
          </a>
        {/if}
      </nav>
    {/if}
  </article>
{/if}

<style>
  .post, .nf { padding: calc(96px + 5vh) 0 clamp(80px, 12vh, 140px); overflow: hidden; }
  .top, .how, .pager { max-width: 920px; }

  .back { display: inline-flex; gap: 8px; font-size: 15px; font-weight: 700; color: var(--xs-muted); text-decoration: none; transition: color 0.3s, gap 0.3s var(--xs-ease); }
  .back:hover { color: var(--xs-pink-2); gap: 12px; }
  .meta { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 16px; margin-top: clamp(28px, 5vh, 48px); }
  .badge { padding: 7px 14px; border-radius: 99px; background: #d6007d; color: #fff; font-size: 13px; font-weight: 800; letter-spacing: 0.04em; }
  .week { font-size: 14px; color: var(--xs-muted); }
  h1 { margin: 20px 0 0; font-size: clamp(36px, 5.2vw, 76px); font-weight: 800; line-height: 1; letter-spacing: -0.04em; text-wrap: balance; }
  .rule { width: 0; height: 8px; margin-top: 28px; transition: width 1.2s var(--xs-ease) 0.2s; }
  .ready .rule { width: min(260px, 40%); }
  .banner { margin-top: 28px; border-radius: 24px; overflow: hidden; }
  .banner :global(.cover) { aspect-ratio: 21 / 8; }
  .lead { margin: 26px 0 0; font-size: clamp(19px, 1.7vw, 24px); line-height: 1.55; color: var(--xs-ink); }
  .top > * { transform: translateY(18px); transition: transform 0.9s var(--xs-ease); }
  .top > .rule { transform: none; }
  .ready .top > * { transform: none; }
  .ready .top > :nth-child(2) { transition-delay: 0.05s; }
  .ready .top > :nth-child(3) { transition-delay: 0.1s; }
  .ready .top > :nth-child(5) { transition-delay: 0.15s; }
  .ready .top > :nth-child(6) { transition-delay: 0.2s; }
  @media (max-width: 700px) { .banner :global(.cover) { aspect-ratio: 16 / 9; } }

  .how { margin-top: clamp(64px, 11vh, 120px); }
  .how-t { margin: 0 0 clamp(24px, 4vh, 40px); font-size: clamp(28px, 3.2vw, 48px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.05; }
  .how-t em { font-style: normal; color: var(--xs-pink-2); }
  .steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 16px; }
  .steps li { display: grid; grid-template-columns: 56px 1fr; gap: 20px; padding: clamp(20px, 2.6vw, 30px); border-radius: 22px; background: var(--xs-card); box-shadow: inset 0 0 0 1px var(--xs-line); }
  .mk { display: block; padding-top: 10px; }
  .mk i { display: block; height: 8px; border-radius: 3px; background: var(--xs-brand); transform-origin: left; transform: scaleX(0); transition: transform 1s var(--xs-ease) 0.2s; }
  .steps li:global(.in) .mk i { transform: scaleX(1); }
  .steps h3 { margin: 0; font-size: 13px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--xs-pink-2); }
  .steps p { margin: 8px 0 0; font-size: clamp(16px, 1.2vw, 18px); line-height: 1.65; }
  .fallback { margin: 0; font-size: 18px; color: var(--xs-muted); }
  .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: clamp(32px, 5vh, 48px); }

  .pager { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: clamp(64px, 10vh, 112px); padding-top: 28px; border-top: 1px solid var(--xs-line); }
  .pg { display: grid; gap: 8px; padding: 20px 22px; border-radius: 18px; color: var(--xs-ink); text-decoration: none; box-shadow: inset 0 0 0 1px var(--xs-line); transition: box-shadow 0.3s, transform 0.4s var(--xs-ease); }
  .pg:hover { box-shadow: inset 0 0 0 1.5px var(--xs-pink); transform: translateY(-3px); }
  .pg.next { text-align: right; }
  .dir { font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--xs-pink-2); }
  .pt { font-size: 17px; font-weight: 700; line-height: 1.3; }

  .nf h1 { margin: 0; }
  .nf p { margin: 18px 0 32px; font-size: 18px; color: var(--xs-muted); }

  @media (max-width: 700px) {
    .steps li { grid-template-columns: 1fr; gap: 12px; }
    .mk { width: 56px; padding-top: 0; }
    .pager { grid-template-columns: 1fr; }
    .pg.next { text-align: left; }
  }
</style>
