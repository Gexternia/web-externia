<script lang="ts">
  import { onMount } from 'svelte';
  import './story.css';
  import { pinProgress, seg, whileVisible } from './scroll';

  const words = [
    { l: 'M', rest: 'edible' },
    { l: 'A', rest: 'sequible' },
    { l: 'P', rest: 'ersonalizado' },
    { l: 'I', rest: 'nnovador' }
  ];

  let el: HTMLElement;
  let on = $state(-1);

  onMount(() =>
    whileVisible(el, () => {
      const p = pinProgress(el);
      el.style.setProperty('--xs-p', p.toFixed(4));
      words.forEach((_, i) => el.style.setProperty(`--m${i}`, seg(p, 0.08 + i * 0.18, 0.22 + i * 0.18).toFixed(4)));
      on = Math.floor(seg(p, 0.08, 0.86) * words.length) - 1 + (p >= 0.86 ? 1 : 0);
    })
  );
</script>

<section class="xs mapi" bind:this={el} aria-label="Filosofía MAPI: Medible, Asequible, Personalizado e Innovador">
  <div class="xs-pin">
    <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i><span class="grid"></span></div>
    <div class="xs-wrap">
      <h2 class="kick">Nuestra filosofía</h2>
      <div class="row" aria-hidden="true">
        {#each words as w, i}
          <div class="col" class:on={i <= on} style="--m: var(--m{i}, 0)">
            <span class="letter"><span class="base">{w.l}</span><span class="fill">{w.l}</span></span>
            <span class="word"><b>{w.l}</b>{w.rest}</span>
          </div>
        {/each}
      </div>
      <p class="foot" class:on={on >= words.length - 1}>Así diseñamos cada activación: medible, asequible, personalizada e innovadora.</p>
    </div>
  </div>
</section>

<style>
  .mapi { height: 300vh; }
  .kick { margin: 0 0 clamp(16px, 4vh, 40px); font-size: clamp(14px, 1.1vw, 16px); font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--xs-muted); }
  .row { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(8px, 2vw, 32px); }
  .col { position: relative; }
  .letter { position: relative; display: block; font-size: clamp(110px, 21vw, 340px); font-weight: 800; line-height: 0.85; letter-spacing: -0.06em; transform: translateY(calc((1 - var(--m)) * 40px)); }
  .base { display: block; color: var(--xs-faint); }
  .fill {
    position: absolute; inset: 0; color: transparent;
    background: var(--xs-brand-text); background-size: 100% 100%; -webkit-background-clip: text; background-clip: text;
    clip-path: inset(calc((1 - var(--m)) * 100%) 0 0 0);
  }
  @supports (background: linear-gradient(in oklch 180deg, red, blue)) {
    .fill { background-image: linear-gradient(in oklch 0deg, #ffc12d 0%, #f7a361 28%, #ee847b 55%, #de3b84 80%, #d6007d 100%); }
  }
  .word { display: block; margin-top: 18px; font-size: clamp(16px, 1.8vw, 28px); font-weight: 800; letter-spacing: -0.01em; opacity: 0; transform: translateY(12px); transition: opacity 0.6s ease, transform 0.8s var(--xs-ease); }
  .word b { color: var(--xs-pink-2); }
  .col.on .word { opacity: 1; transform: none; }
  .foot { margin: clamp(28px, 6vh, 64px) 0 0; font-size: clamp(18px, 1.6vw, 24px); color: var(--xs-muted); max-width: 44ch; opacity: 0; transform: translateY(14px); transition: opacity 0.8s ease, transform 0.9s var(--xs-ease); }
  .foot.on { opacity: 1; transform: none; }

  @media (max-width: 700px) {
    .row { grid-template-columns: repeat(2, 1fr); row-gap: 28px; }
    .letter { font-size: 38vw; }
  }
</style>
