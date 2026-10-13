<script lang="ts">
  import { onMount } from 'svelte';
  import './story.css';
  import { clamp, whileVisible } from './scroll';

  interface Cta { href: string; label: string; ghost?: boolean }
  interface Props {
    /** use \n for line breaks */
    title: string;
    /** words of the title painted in brand pink */
    accent?: string;
    lead?: string;
    meta?: string;
    ctas?: Cta[];
  }
  let { title, accent = '', lead = '', meta = '', ctas = [] }: Props = $props();

  const hot = $derived(new Set(accent.split(/\s+/).filter(Boolean)));
  const lines = $derived.by(() => {
    let i = 0;
    return title.split('\n').map((l) => l.split(/\s+/).filter(Boolean).map((w) => ({ w, i: i++ })));
  });

  let el: HTMLElement;
  let ready = $state(false);

  onMount(() => {
    requestAnimationFrame(() => (ready = true));
    return whileVisible(el, () => {
      el.style.setProperty('--xs-p', clamp(scrollY / Math.max(1, el.offsetHeight)).toFixed(4));
    });
  });
</script>

<section class="xs hero" class:ready bind:this={el}>
  <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i><span class="grid"></span></div>

  <!-- The E, oversized; its bars slide apart as you leave the hero -->
  <div class="bigE" aria-hidden="true">
    <span class="b b1"><i></i></span>
    <span class="b b2"><i></i></span>
    <span class="b b3"><i></i></span>
    <span class="d"><i></i></span>
  </div>

  <div class="xs-wrap inner">
    <h1 class="title">
      {#each lines as words}
        <span class="line">
          {#each words as { w, i }}<span class="w"><span class:hot={hot.has(w)} style="--i: {i}">{w}</span></span>{' '}{/each}
        </span>
      {/each}
    </h1>
    {#if lead}<p class="lead">{lead}</p>{/if}
    {#if meta}<p class="meta">{meta}</p>{/if}
    {#if ctas.length}
      <div class="ctas">
        {#each ctas as c}
          <a class="xs-btn" class:xs-btn--ghost={c.ghost} href={c.href}>{c.label} <span aria-hidden="true">→</span></a>
        {/each}
      </div>
    {/if}
  </div>

  <div class="cue" aria-hidden="true"><span></span></div>
</section>

<style>
  .hero { min-height: 100vh; min-height: 100svh; display: flex; align-items: center; overflow: hidden; padding: calc(80px + 6vh) 0 14vh; }
  .inner { z-index: 2; }

  .title { margin: 0; font-size: clamp(44px, 6.6vw, 112px); font-weight: 800; line-height: 0.95; letter-spacing: -0.045em; max-width: min(13ch, 56vw); }
  .line { display: block; }
  .w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.08em; margin-bottom: -0.08em; }
  .w > span { display: inline-block; transform: translateY(105%); transition: transform 1.1s var(--xs-ease); transition-delay: calc(var(--i) * 60ms + 120ms); }
  .ready .w > span { transform: none; }
  .hot { color: var(--xs-pink-2); }

  .lead, .meta, .ctas { transform: translateY(20px); transition: transform 1s var(--xs-ease); }
  .ready .lead, .ready .meta, .ready .ctas { transform: none; }
  .lead { margin: clamp(24px, 4vh, 40px) 0 0; max-width: min(52ch, 52vw); font-size: clamp(17px, 1.45vw, 22px); line-height: 1.6; color: var(--xs-muted); transition-delay: 0.2s; }
  .meta { margin: 18px 0 0; font-size: 13px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--xs-pink-2); transition-delay: 0.25s; }
  .ctas { margin-top: clamp(28px, 5vh, 44px); display: flex; flex-wrap: wrap; gap: 12px; transition-delay: 0.3s; }

  /* Oversized E */
  .bigE { position: absolute; z-index: 1; right: -10vw; top: 50%; width: min(40vw, 600px); aspect-ratio: 32 / 25; transform: translateY(-50%); pointer-events: none; }
  .b { position: absolute; left: 0; height: 20%; transform: translateX(calc(var(--xs-p, 0) * var(--dx))); will-change: transform; }
  .b i { position: absolute; inset: 0; border-radius: 6px; background: var(--xs-brand); transform-origin: left; transform: scaleX(0); transition: transform 1.4s var(--xs-ease); }
  .ready .b i { transform: scaleX(1); }
  .b1 { top: 0; width: 100%; --dx: 22vw; }
  .b2 { top: 40%; width: 68.75%; --dx: 34vw; }
  .b3 { top: 80%; width: 100%; --dx: 14vw; }
  .b2 i { transition-delay: 0.12s; }
  .b3 i { transition-delay: 0.24s; }
  .d { position: absolute; right: 0; top: 40%; width: 15.6%; aspect-ratio: 1; transform: translate(6%, calc(var(--xs-p, 0) * -40vh)); }
  .d i { position: absolute; inset: 0; border-radius: 50%; background: #d6007d; transform: scale(0); transition: transform 0.8s var(--xs-ease) 0.6s; }
  .ready .d i { transform: scale(1); }
  .d i::after { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--xs-pink-2); animation: ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite; }
  @keyframes ping { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.6); opacity: 0; } }

  .cue { position: absolute; left: clamp(16px, 4vw, 48px); bottom: 32px; width: 1px; height: 56px; background: var(--xs-faint); overflow: hidden; }
  .cue span { position: absolute; left: 0; top: -40%; width: 1px; height: 40%; background: var(--xs-pink); animation: cue 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
  @keyframes cue { to { top: 110%; } }

  @media (max-width: 900px) {
    .hero { align-items: flex-end; }
    .bigE { width: 74vw; right: -24vw; top: 26%; opacity: 0.5; }
    .title { max-width: none; }
    .lead { max-width: none; }
  }
</style>
