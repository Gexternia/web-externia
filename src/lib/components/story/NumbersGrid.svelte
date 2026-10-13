<script lang="ts">
  import './story.css';
  import { reveal, viewProgress } from './reveal';

  const stats = [
    { value: 2300, suffix: '+', label: 'caricaturas generadas por IA en un solo evento' },
    { value: 600, suffix: '+', label: 'asignaciones de asientos automatizadas' },
    { value: 4800, suffix: '+', label: 'conexiones inteligentes de matchmaking' },
    { value: 1200, suffix: '+', label: 'registros gestionados con lenguaje natural' },
    { value: 5, suffix: '', label: 'grandes agencias españolas en los primeros 2 meses' },
    { value: 400, suffix: 'h+', label: 'de consultoría estratégica en IA en el último año' }
  ];
  const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
</script>

<section class="xs xs-section numbers" use:viewProgress aria-label="Nuestros números">
  <div class="xs-ambient" aria-hidden="true"><i class="a2"></i></div>
  <div class="xs-wrap">
    <div class="head" data-rv use:reveal>
      <h2 class="xs-h2">Nuestros números <em>hablan.</em></h2>
      <p class="xs-lead">Lo que ya hemos conseguido aplicando la IA en eventos reales.</p>
    </div>

    <div class="grid">
      {#each stats as s, i}
        <article class="stat" use:reveal style="--col: {i % 3}">
          <span class="sr-only">{fmt(s.value)}{s.suffix}</span>
          <span class="num" aria-hidden="true">
            {#each fmt(s.value).split('') as ch, k}
              {#if ch === '.'}
                <span class="sep">.</span>
              {:else}
                <span class="reel"><span class="strip" style="--d: {+ch}; --k: {k}">{#each digits as d}<span>{d}</span>{/each}</span></span>
              {/if}
            {/each}
            <span class="suf">{s.suffix}</span>
          </span>
          <span class="rule" aria-hidden="true"><i></i></span>
          <p>{s.label}</p>
        </article>
      {/each}
    </div>
  </div>
</section>

<style>
  .numbers { overflow: hidden; }
  .head { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 64px; align-items: end; margin-bottom: clamp(48px, 9vh, 96px); }
  .head .xs-h2 { font-size: clamp(36px, 5vw, 80px); }
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(48px, 8vh, 88px) clamp(32px, 5vw, 80px); }

  /* gentle parallax: each column drifts at its own pace */
  .stat { transform: translateY(calc((var(--vp, 0.5) - 0.5) * (var(--col) - 1) * -60px)); }

  .num { display: flex; align-items: flex-end; font-size: clamp(64px, 7vw, 112px); font-weight: 800; line-height: 1; letter-spacing: -0.04em; color: var(--xs-ink); font-variant-numeric: tabular-nums; }
  .num { opacity: 0.18; transition: opacity 0.6s ease; transition-delay: calc(var(--col) * 150ms); }
  .stat:global(.in) .num { opacity: 1; }
  .reel { display: inline-block; height: 1em; overflow: hidden; }
  .strip { display: flex; flex-direction: column; transform: translateY(0); transition: transform 1.8s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: calc(var(--k) * 120ms + var(--col) * 150ms); }
  .strip span { height: 1em; display: block; text-align: center; }
  .stat:global(.in) .strip { transform: translateY(calc(var(--d) * -1em)); }
  .suf { margin-left: 0.04em; color: var(--xs-pink-2); opacity: 0; transform: translateY(0.3em); transition: opacity 0.6s ease, transform 0.8s var(--xs-ease); transition-delay: calc(0.9s + var(--col) * 150ms); }
  .stat:global(.in) .suf { opacity: 1; transform: none; }

  .rule { display: block; height: 2px; margin: 24px 0 18px; background: var(--xs-line); overflow: hidden; }
  .rule i { display: block; height: 100%; background: var(--xs-pink); transform-origin: left; transform: scaleX(0); transition: transform 1.4s var(--xs-ease); transition-delay: calc(0.3s + var(--col) * 150ms); }
  .stat:global(.in) .rule i { transform: scaleX(0.35); }
  .stat:hover .rule i { transform: scaleX(1); }
  .stat p { margin: 0; font-size: clamp(16px, 1.25vw, 19px); line-height: 1.5; color: var(--xs-muted); max-width: 26ch; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  @media (max-width: 900px) {
    .head { grid-template-columns: 1fr; }
    .grid { grid-template-columns: 1fr 1fr; gap: 40px 20px; }
    .stat { transform: none; }
    .num { font-size: clamp(44px, 12vw, 64px); }
  }
</style>
