<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import './story.css';
  import { clamp, whileVisible } from './scroll';

  interface Stop { num: string; title: string; desc: string }
  interface Props {
    stops: Stop[];
    extras?: string[];
    extrasTitle?: string;
    heading?: string;
    /** the illustration for each stop; it animates when the route reaches it (`.on` on its stop) */
    visual?: Snippet<[number]>;
  }
  let { stops, extras = [], extrasTitle = 'Y además, te acompañamos en', heading = '', visual }: Props = $props();

  let root: HTMLElement;
  let path: SVGPathElement;
  let track: SVGPathElement;
  let dot: HTMLElement;
  let vb = $state('0 0 100 100');
  let reached = $state(-1);

  // keep names like "AI-mplementación" on one line and paint the IA fragment
  const parts = (t: string) => t.replace(/-/g, '‑').split(/(IA|AI)/);

  onMount(() => {
    let len = 1;
    let fracs: number[] = [];
    const build = () => {
      const W = root.clientWidth, H = root.clientHeight;
      const rb = root.getBoundingClientRect();
      const anchors = [...root.querySelectorAll<HTMLElement>('[data-anchor]')].map((a) => {
        const r = a.getBoundingClientRect();
        return { x: r.left - rb.left + r.width / 2, y: r.top - rb.top + r.height / 2 };
      });
      const pts = [{ x: W / 2, y: 0 }, ...anchors, { x: W / 2, y: H }];
      let d = `M${pts[0].x},${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], my = (a.y + b.y) / 2;
        d += ` C${a.x},${my} ${b.x},${my} ${b.x},${b.y}`;
      }
      vb = `0 0 ${W} ${H}`;
      path.setAttribute('d', d);
      track.setAttribute('d', d);
      len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      // where along the path each stop sits
      fracs = anchors.map((a) => {
        let lo = 0, hi = len;
        for (let k = 0; k < 18; k++) { const mid = (lo + hi) / 2; if (path.getPointAtLength(mid).y < a.y) lo = mid; else hi = mid; }
        return lo / len;
      });
      tick();
    };
    const tick = () => {
      const r = root.getBoundingClientRect();
      const p = clamp((innerHeight * 0.72 - r.top) / r.height);
      path.style.strokeDashoffset = `${len * (1 - p)}`;
      const pt = path.getPointAtLength(len * p);
      dot.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      reached = fracs.reduce((acc, f, i) => (p >= f - 0.01 ? i : acc), -1);
    };
    const ro = new ResizeObserver(build);
    ro.observe(root);
    document.fonts?.ready.then(build);
    const stop = whileVisible(root, tick);
    return () => { ro.disconnect(); stop(); };
  });
</script>

<section class="xs road" aria-label={heading || 'Recorrido'}>
  <div class="xs-wrap">
    {#if heading}<h2 class="xs-h2 head">{heading}</h2>{/if}
  </div>

  <div class="route" bind:this={root}>
    <svg class="lines" viewBox={vb} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="road-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#FFC12D" /><stop offset=".28" stop-color="#F7A361" /><stop offset=".55" stop-color="#EE847B" /><stop offset=".8" stop-color="#DE3B84" /><stop offset="1" stop-color="#D6007D" />
        </linearGradient>
      </defs>
      <path bind:this={track} class="trk" />
      <path bind:this={path} class="ink" />
    </svg>
    <span class="runner" bind:this={dot} aria-hidden="true"></span>

    {#each stops as st, i}
      <div class="xs-wrap stop" class:flip={i % 2 === 1} class:on={reached >= i}>
        <div class="text">
          <span class="num" class:wide={st.num.length > 2} data-anchor>{st.num}</span>
          <h3>{#each parts(st.title) as part}{#if part === 'IA' || part === 'AI'}<em>{part}</em>{:else}{part}{/if}{/each}</h3>
          <p>{st.desc}</p>
        </div>
        <div class="visual" aria-hidden="true">
          {#if visual}{@render visual(i)}{/if}
        </div>
      </div>
    {/each}

    {#if extras.length}
      <div class="xs-wrap stop end" class:on={reached >= stops.length}>
        <div class="text">
          <span class="num flag" data-anchor>+</span>
          <h3>{extrasTitle}</h3>
        </div>
        <ul class="stamps">
          {#each extras as e, k}<li style="--k: {k}; --r: {[-4, 3, -2, 5][k % 4]}deg">{e}</li>{/each}
        </ul>
      </div>
    {/if}
  </div>
</section>

<style>
  .road { padding: clamp(96px, 14vh, 160px) 0 clamp(40px, 8vh, 80px); overflow: hidden; }
  .head { font-size: clamp(36px, 5vw, 80px); max-width: 15ch; margin-bottom: clamp(24px, 6vh, 64px); }
  .route { position: relative; }
  .lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: -1; overflow: visible; }
  .trk { fill: none; stroke: var(--xs-line); stroke-width: 2; stroke-dasharray: 2 10; stroke-linecap: round; }
  .ink { fill: none; stroke: url(#road-grad); stroke-width: 5; stroke-linecap: round; }
  .runner { position: absolute; left: 0; top: 0; width: 30px; height: 30px; margin: -15px 0 0 -15px; border-radius: 50%; background: #d6007d; box-shadow: 0 0 0 8px rgba(214, 0, 125, 0.18), 0 10px 30px rgba(214, 0, 125, 0.5); z-index: 3; will-change: transform; }

  .stop { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 6vw, 96px); align-items: center; min-height: 72vh; padding-top: 4vh; padding-bottom: 4vh; }
  .stop.flip .text { order: 2; }
  .text { max-width: 30rem; }
  .flip .text { justify-self: end; }
  .num { display: inline-grid; place-items: center; width: clamp(96px, 9vw, 132px); aspect-ratio: 1; border-radius: 50%; font-size: clamp(36px, 3.4vw, 52px); font-weight: 800; letter-spacing: -0.04em; color: var(--xs-muted); background: var(--xs-bg); box-shadow: inset 0 0 0 2px var(--xs-line); transition: color 0.5s, box-shadow 0.5s, background 0.5s, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .num.wide { width: auto; aspect-ratio: auto; padding: 0.32em 0.62em; border-radius: 999px; }
  .on .num { color: #fff; background: var(--xs-brand); box-shadow: 0 20px 40px -18px rgba(214, 0, 125, 0.7); transform: scale(1.06); }
  .flag { font-size: clamp(44px, 4vw, 64px); }
  h3 { margin: 26px 0 0; font-size: clamp(34px, 3.6vw, 60px); font-weight: 800; line-height: 1; letter-spacing: -0.035em; }
  h3 em { font-style: normal; color: var(--xs-pink-2); }
  .text p { margin: 18px 0 0; font-size: clamp(16px, 1.25vw, 19px); line-height: 1.6; color: var(--xs-muted); }
  .text h3, .text p { opacity: 0.35; transform: translateY(20px); transition: opacity 0.7s ease, transform 0.9s var(--xs-ease); }
  .on .text h3, .on .text p { opacity: 1; transform: none; }
  .on .text p { transition-delay: 0.1s; }

  .visual { position: relative; aspect-ratio: 5 / 4; width: 100%; max-width: 560px; justify-self: center; }

  /* + · stamps at the end of the route */
  .end { min-height: 60vh; }
  .stamps { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .stamps li { display: grid; place-items: center; text-align: center; aspect-ratio: 16 / 10; padding: 16px; border-radius: 20px; font-size: clamp(17px, 1.5vw, 22px); font-weight: 800; letter-spacing: -0.01em; background: var(--xs-card); box-shadow: inset 0 0 0 2px var(--xs-pink); color: var(--xs-ink); opacity: 0; transform: scale(1.4) rotate(calc(var(--r) * 3)); transition: opacity 0.4s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); transition-delay: calc(var(--k) * 0.14s); }
  .on .stamps li { opacity: 1; transform: rotate(var(--r)); }
  .stamps li:hover { transform: rotate(0) scale(1.04); }

  @media (max-width: 900px) {
    .stop { grid-template-columns: 1fr; min-height: auto; padding-top: 10vh; padding-bottom: 4vh; gap: 28px; }
    .stop.flip .text { order: 0; justify-self: start; }
    .visual { aspect-ratio: 4 / 3; max-width: 100%; }
  }
</style>
