<script lang="ts">
  import { onMount } from 'svelte';
  import './story.css';
  import { clamp, whileVisible } from './scroll';
  import { reveal } from './reveal';

  interface Program {
    num: string; title: string; level: string; intro: string; listTitle: string; items: string[];
    duracion: string; dirigido: string; modalidad: string; extra?: string;
  }
  let { programs, heading = '', sub = '' }: { programs: Program[]; heading?: string; sub?: string } = $props();

  let el: HTMLElement;

  onMount(() => {
    const cards = [...el.querySelectorAll<HTMLElement>('.card')];
    // stick each card so that it always fits in the viewport, even when it's tall
    const place = () => cards.forEach((c, i) => {
      c.style.top = `${Math.min(96 + i * 22, innerHeight - c.offsetHeight - 24)}px`;
    });
    place();
    addEventListener('resize', place);
    const stop = whileVisible(el, () => {
      // each card sinks back a little as the next one slides over it
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const t = clamp(1 - (next.getBoundingClientRect().top - 120) / innerHeight);
        c.style.setProperty('--under', t.toFixed(4));
        c.classList.toggle('under', t > 0.001);
      });
    });
    return () => { stop(); removeEventListener('resize', place); };
  });
</script>

<section class="xs stack" bind:this={el}>
  <div class="xs-wrap">
    {#if heading}
      <div class="head" data-rv use:reveal>
        <h2 class="xs-h2">{@html heading}</h2>
        {#if sub}<p class="xs-lead">{sub}</p>{/if}
      </div>
    {/if}
    {#each programs as p, i}
      <article class="card" style="--i: {i}">
        <div class="card-in">
          <header>
            <span class="num">{p.num}</span>
            <div>
              <span class="level">{p.level}</span>
              <h3>{p.title}</h3>
            </div>
            <span class="xs-bar cbar" aria-hidden="true" style="width: {i === 1 ? 68.75 : 100}%"></span>
          </header>
          <p class="intro">{p.intro}</p>
          <div class="body">
            <div class="list">
              <h4>{p.listTitle}</h4>
              <ul>{#each p.items as it}<li>{it}</li>{/each}</ul>
              {#if p.extra}<p class="extra">{p.extra}</p>{/if}
            </div>
            <dl class="facts">
              <div><dt>Duración</dt><dd>{p.duracion}</dd></div>
              <div><dt>Dirigido a</dt><dd>{p.dirigido}</dd></div>
              <div><dt>Modalidad</dt><dd>{p.modalidad}</dd></div>
            </dl>
          </div>
        </div>
      </article>
    {/each}
  </div>
</section>

<style>
  .stack { padding: clamp(96px, 14vh, 160px) 0 clamp(60px, 10vh, 120px); }
  .head { margin-bottom: clamp(40px, 7vh, 72px); display: grid; gap: 20px; }
  .card { position: sticky; top: 96px; margin-bottom: 8vh; }
  .card-in {
    border-radius: 28px; padding: clamp(24px, 3.4vw, 48px); background: var(--xs-card);
    box-shadow: inset 0 0 0 1px var(--xs-line), 0 40px 80px -40px rgba(0, 0, 0, 0.6);
    position: relative; transform-origin: 50% 0;
  }
  .card.under .card-in { transform: scale(calc(1 - var(--under, 0) * 0.05)); }
  .card-in::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: #000; opacity: calc(var(--under, 0) * 0.4); pointer-events: none; }
  :global(.light) .card-in { box-shadow: inset 0 0 0 1px var(--xs-line), 0 40px 80px -50px rgba(20, 16, 20, 0.35); }
  :global(.light) .card-in::after { background: #fff; opacity: calc(var(--under, 0) * 0.5); }
  header { display: grid; grid-template-columns: auto 1fr; align-items: end; gap: 8px 24px; }
  .num { font-size: clamp(64px, 7vw, 110px); font-weight: 800; line-height: 0.85; letter-spacing: -0.05em; background: var(--xs-brand-text); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .level { font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--xs-pink-2); }
  h3 { margin: 6px 0 0; font-size: clamp(30px, 3.4vw, 54px); font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
  .cbar { grid-column: 1 / -1; margin-top: 18px; height: 6px; }
  .intro { margin: 24px 0 0; font-size: clamp(17px, 1.35vw, 21px); line-height: 1.55; max-width: 62ch; }
  .body { display: grid; grid-template-columns: 1.5fr 1fr; gap: clamp(24px, 4vw, 56px); margin-top: 28px; }
  h4 { margin: 0 0 12px; font-size: 13px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--xs-muted); }
  ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; }
  li { position: relative; padding-left: 22px; font-size: 15px; line-height: 1.55; color: var(--xs-muted); }
  li::before { content: ''; position: absolute; left: 0; top: 0.62em; width: 10px; height: 4px; border-radius: 2px; background: var(--xs-brand); }
  .extra { margin: 18px 0 0; padding-left: 14px; border-left: 2px solid var(--xs-pink); font-size: 14px; line-height: 1.55; color: var(--xs-muted); }
  .facts { margin: 0; display: grid; gap: 16px; align-content: start; padding: 20px; border-radius: 18px; background: var(--xs-bg-2); }
  .facts dt { font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--xs-pink-2); }
  .facts dd { margin: 4px 0 0; font-size: 15px; line-height: 1.45; }

  @media (max-width: 900px) {
    .card { position: relative; top: 0 !important; margin-bottom: 20px; }
    .card-in { transform: none; }
    .card-in::after { display: none; }
    .body { grid-template-columns: 1fr; }
  }
</style>
