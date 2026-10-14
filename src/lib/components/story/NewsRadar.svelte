<script lang="ts">
  import { onMount } from 'svelte';
  import './story.css';

  interface Item { titulo: string }
  let { items, semana = '' }: { items: Item[]; semana?: string } = $props();

  const SWEEP = 6; // seconds per turn
  // deterministic positions: spread angles, alternate rings
  const blips = $derived(
    items.map((it, i) => {
      const a = (i / items.length) * 360 + 20 + ((i * 37) % 23);
      const r = 20 + ((i * 53) % 3) * 9 + (i % 2) * 5;
      const rad = (a - 90) * (Math.PI / 180);
      return { i, title: it.titulo || 'Sin título', a, x: 50 + Math.cos(rad) * r, y: 50 + Math.sin(rad) * r };
    })
  );
  let hover = $state(-1);
  let wrap: HTMLElement;
  let paused = $state(true);
  onMount(() => {
    const io = new IntersectionObserver(([e]) => (paused = !e.isIntersecting));
    io.observe(wrap);
    return () => io.disconnect();
  });
  const num = (i: number) => String(i + 1).padStart(2, '0');
</script>

<div class="radar-wrap" class:paused bind:this={wrap}>
  <div class="radar" style="--sweep: {SWEEP}s">
    <span class="ring r1"></span><span class="ring r2"></span><span class="ring r3"></span>
    <span class="axis h"></span><span class="axis v"></span>
    <span class="beam"></span>
    <span class="core"><i></i><i></i><i></i><b></b></span>
    {#each blips as b}
      <a
        class="blip"
        class:on={hover === b.i}
        href="/blog/{b.i}"
        style="left: {b.x}%; top: {b.y}%; --delay: {((b.a / 360) * SWEEP).toFixed(2)}s"
        onmouseenter={() => (hover = b.i)}
        onmouseleave={() => (hover = -1)}
        onfocus={() => (hover = b.i)}
        onblur={() => (hover = -1)}
        aria-label="{num(b.i)}: {b.title}"
      >
        <span class="ping"></span>
        <span class="pt"><i class="flash"></i><em>{num(b.i)}</em></span>
        <span class="tip" class:left={b.x > 58}>{b.title}</span>
      </a>
    {/each}
  </div>
  <div class="legend">
    <span class="live"></span> Escaneando {items.length} novedades{#if semana} · {semana}{/if}
  </div>
</div>

<style>
  .radar-wrap { display: grid; justify-items: center; gap: 16px; }
  .radar { position: relative; width: min(100%, 560px); aspect-ratio: 1; border-radius: 50%; background: radial-gradient(closest-side, rgba(214, 0, 125, 0.08), transparent 70%); }
  :global(.light) .radar { background: radial-gradient(closest-side, rgba(214, 0, 125, 0.06), transparent 70%); }
  .ring { position: absolute; border-radius: 50%; border: 1px solid var(--xs-line); }
  .r1 { inset: 0; }
  .r2 { inset: 17%; }
  .r3 { inset: 34%; }
  .axis { position: absolute; background: var(--xs-faint); }
  .axis.h { left: 0; right: 0; top: 50%; height: 1px; }
  .axis.v { top: 0; bottom: 0; left: 50%; width: 1px; }
  .beam { position: absolute; inset: 0; will-change: transform; border-radius: 50%; background: conic-gradient(from 0deg, transparent 72%, rgba(255, 193, 45, 0.16) 90%, rgba(214, 0, 125, 0.5)); animation: spin var(--sweep) linear infinite; mask: radial-gradient(closest-side, #000 99%, transparent); }
  @keyframes spin { to { transform: rotate(360deg); } }
  .core { position: absolute; left: 50%; top: 50%; width: 15%; aspect-ratio: 32 / 25; transform: translate(-50%, -50%); }
  .core i { position: absolute; left: 0; height: 20%; border-radius: 2px; background: var(--xs-brand); }
  .core i:nth-child(1) { top: 0; width: 100%; }
  .core i:nth-child(2) { top: 40%; width: 68.75%; }
  .core i:nth-child(3) { top: 80%; width: 100%; }
  .core b { position: absolute; right: 0; top: 40%; width: 15.6%; aspect-ratio: 1; border-radius: 50%; background: #d6007d; }

  .blip { position: absolute; z-index: 2; width: 34px; height: 34px; margin: -17px 0 0 -17px; display: grid; place-items: center; border-radius: 50%; text-decoration: none; }
  .pt { position: relative; z-index: 2; overflow: hidden; will-change: transform; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: #d6007d; color: #fff; font-size: 11px; font-weight: 800; box-shadow: 0 0 0 3px var(--xs-bg); transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s; animation: hit var(--sweep) linear infinite; animation-delay: var(--delay); }
  @keyframes hit { 0%, 6% { transform: scale(1.35); } 14%, 100% { transform: scale(1); } }
  .pt em { position: relative; font-style: normal; }
  .flash { position: absolute; inset: 0; border-radius: 50%; background: #ff5fa8; opacity: 0; animation: flash var(--sweep) linear infinite; animation-delay: var(--delay); }
  @keyframes flash { 0%, 6% { opacity: 1; } 14%, 100% { opacity: 0; } }
  .paused .beam, .paused .pt, .paused .ping, .paused .flash, .paused .live { animation-play-state: paused; }
  .ping { position: absolute; inset: 0; border-radius: 50%; border: 2px solid #ff5fa8; opacity: 0; animation: ping var(--sweep) ease-out infinite; animation-delay: var(--delay); }
  @keyframes ping { 0% { transform: scale(0.6); opacity: 0.9; } 18% { transform: scale(2.4); opacity: 0; } 100% { opacity: 0; } }
  .blip:hover .pt, .blip.on .pt, .blip:focus-visible .pt { transform: scale(1.3); background: #ffc12d; color: #2a1406; animation: none; }
  .blip:hover .flash, .blip.on .flash { display: none; }
  .tip { position: absolute; left: 40px; top: 50%; z-index: 3; width: max-content; max-width: 240px; padding: 10px 14px; border-radius: 12px; background: var(--xs-card); color: var(--xs-ink); box-shadow: inset 0 0 0 1px var(--xs-line), 0 20px 40px -20px rgba(0, 0, 0, 0.6); font-size: 14px; font-weight: 700; line-height: 1.3; opacity: 0; transform: translate(-6px, -50%); pointer-events: none; transition: opacity 0.25s, transform 0.35s var(--xs-ease); }
  .tip.left { left: auto; right: 40px; transform: translate(6px, -50%); }
  .blip:hover .tip, .blip.on .tip, .blip:focus-visible .tip { opacity: 1; transform: translate(0, -50%); }
  .blip:focus-visible { outline: 2px solid var(--xs-pink); outline-offset: 4px; }

  .legend { display: inline-flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; color: var(--xs-muted); text-align: center; }
  .live { position: relative; width: 9px; height: 9px; border-radius: 50%; background: #d6007d; flex: none; }
  .live::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: rgba(214, 0, 125, 0.35); animation: live 1.4s ease-out infinite; }
  @keyframes live { to { transform: scale(2.6); opacity: 0; } }
  .paused .live::after { animation-play-state: paused; }

  @media (max-width: 700px) {
    .tip { display: none; }
    .pt { width: 26px; height: 26px; font-size: 10px; }
  }
</style>
