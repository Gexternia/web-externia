<script lang="ts">
  import { onMount } from 'svelte';
  import './story.css';
  import { pinProgress, seg, whileVisible } from './scroll';

  const phrase1 = ['No', 'somos', 'una', 'empresa', 'de', 'tecnología', 'que', 'hace', 'eventos.'];
  const phrase2 = ['Somos', 'especialistas', 'en', 'eventos', 'que', 'dominan', 'la', 'Inteligencia', 'Artificial.'];
  const strong = new Set(['especialistas', 'dominan', 'Inteligencia', 'Artificial.']);
  const total = phrase1.length + phrase2.length;

  let el: HTMLElement;
  let lit = $state(0);

  onMount(() =>
    whileVisible(el, () => {
      const p = pinProgress(el);
      el.style.setProperty('--xs-p', p.toFixed(4));
      el.style.setProperty('--b1', seg(p, 0, 0.14).toFixed(4));
      el.style.setProperty('--b2', seg(p, 0.07, 0.21).toFixed(4));
      el.style.setProperty('--b3', seg(p, 0.14, 0.28).toFixed(4));
      el.style.setProperty('--dot', seg(p, 0.26, 0.34).toFixed(4));
      el.style.setProperty('--sweep', seg(p, 0.3, 1).toFixed(4));
      lit = Math.round(seg(p, 0.3, 0.92) * total);
    })
  );
</script>

<section class="xs manifest" bind:this={el} aria-label="Manifiesto">
  <div class="xs-pin">
    <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a3"></i><span class="grid"></span></div>
    <div class="xs-wrap grid2">
      <div class="mark" aria-hidden="true">
        <span class="bar bar1"><i></i></span>
        <span class="bar bar2"><i></i></span>
        <span class="bar bar3"><i></i></span>
        <span class="dot"></span>
      </div>
      <p class="words">
        {#each phrase1 as w, i}<span class="w" class:on={i < lit}>{w}</span>{' '}{/each}
        <br />
        {#each phrase2 as w, i}<span class="w" class:on={phrase1.length + i < lit} class:strong={strong.has(w)}>{w}</span>{' '}{/each}
      </p>
    </div>
    <div class="hint" aria-hidden="true"><span></span></div>
  </div>
</section>

<style>
  .manifest { height: 300vh; }
  .grid2 { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); align-items: center; gap: clamp(32px, 6vw, 96px); }

  /* The Externia "E": bars 32 / 22 / 32 units wide plus the dot, as in the logo */
  .mark { position: relative; width: 100%; max-width: 440px; aspect-ratio: 32 / 25; justify-self: center; }
  .bar { position: absolute; left: 0; height: 20%; border-radius: 3px; overflow: hidden; }
  .bar i { position: absolute; inset: 0; background: var(--xs-brand); transform-origin: left center; will-change: transform; }
  .bar i::after { content: ''; position: absolute; inset: 0; width: 35%; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent); transform: translateX(calc(var(--sweep, 0) * 420% - 120%)); mix-blend-mode: overlay; }
  .bar1 { top: 0; width: 100%; }
  .bar2 { top: 40%; width: 68.75%; }
  .bar3 { top: 80%; width: 100%; }
  .bar1 i { transform: scaleX(var(--b1, 0)); }
  .bar2 i { transform: scaleX(var(--b2, 0)); }
  .bar3 i { transform: scaleX(var(--b3, 0)); }
  .bar { box-shadow: 0 20px 50px -20px rgba(214, 0, 125, calc(var(--b3, 0) * 0.7)); }
  .dot { position: absolute; right: 0; top: 40%; width: 15.6%; aspect-ratio: 1; border-radius: 50%; background: #d6007d; transform: translate(6%, 0) scale(var(--dot, 0)); }
  .dot::after { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--xs-pink-2); opacity: 0; animation: ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite; }
  @keyframes ping { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.6); opacity: 0; } }

  .words { margin: 0; font-size: clamp(28px, 3.6vw, 54px); font-weight: 800; line-height: 1.12; letter-spacing: -0.02em; text-wrap: balance; }
  .w { color: var(--xs-faint); transition: color 0.45s ease; }
  .w.on { color: var(--xs-ink); }
  .w.strong.on { color: var(--xs-pink-2); }

  .hint { position: absolute; left: 50%; bottom: 28px; width: 1px; height: 48px; background: var(--xs-faint); overflow: hidden; }
  .hint span { position: absolute; left: 0; top: -40%; width: 1px; height: 40%; background: var(--xs-pink); animation: hint 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
  @keyframes hint { to { top: 110%; } }

  @media (max-width: 900px) {
    .grid2 { grid-template-columns: 1fr; gap: 36px; }
    .mark { max-width: 220px; justify-self: start; }
  }
</style>
