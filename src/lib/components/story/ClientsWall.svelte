<script lang="ts">
  import { onMount } from 'svelte';
  import './story.css';
  import { pinProgress, seg, whileVisible } from './scroll';

  const logos = [
    { id: 'caixabank', name: 'CaixaBank' }, { id: 'amazon', name: 'Amazon' }, { id: 'kpmg', name: 'KPMG' },
    { id: 'american-express', name: 'American Express' }, { id: 'ing', name: 'ING' }, { id: 'el-economista', name: 'elEconomista' },
    { id: 'stage-entertainment', name: 'Stage Entertainment' }, { id: 'eventoplus', name: 'Eventoplus' }, { id: 'ifaes', name: 'IFAES' },
    { id: 'opc-catalunya', name: 'OPC Catalunya' }, { id: 'ecoener', name: 'Ecoener' }, { id: 'idipaz', name: 'IdiPAZ' },
    { id: 'universidad-cordoba', name: 'Universidad de Córdoba' }, { id: 'camara-espanola', name: 'Cámara Española' }, { id: 'aegve', name: 'AEGVE' },
    { id: 'uppereat', name: 'UpperEat' }, { id: 'cett', name: 'CETT' }, { id: 'snapsight', name: 'Snapsight' },
    { id: 'somos-experiences', name: 'Somos Experiences' }
  ];

  // Deterministic scatter so the layout is identical on server and client
  const rand = (i: number, k: number) => {
    const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const scatter = logos.map((_, i) => ({
    dx: (rand(i, 1) - 0.5) * 120,
    dy: (rand(i, 2) - 0.5) * 140 + (i % 2 ? 40 : -40),
    r: (rand(i, 3) - 0.5) * 70,
    s: 0.6 + rand(i, 4) * 0.9
  }));

  let el: HTMLElement;
  let shown = $state(0);

  onMount(() =>
    whileVisible(el, () => {
      const p = pinProgress(el);
      const k = 1 - seg(p, 0.05, 0.7);
      const eased = k * k * (3 - 2 * k);
      el.style.setProperty('--xs-p', p.toFixed(4));
      el.style.setProperty('--k', eased.toFixed(4));
      el.style.setProperty('--t', seg(p, 0.55, 0.8).toFixed(4));
      shown = Math.round(seg(p, 0.05, 0.7) * logos.length);
    })
  );
</script>

<section class="xs clients" bind:this={el} aria-label="Clientes que confían en nosotros">
  <div class="xs-pin">
    <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a3"></i><span class="grid"></span></div>
    <div class="xs-wrap">
      <div class="head">
        <h2 class="xs-h2">Marcas que ya <em>cambiaron</em> sus eventos.</h2>
        <p class="count" aria-hidden="true"><b>{shown}</b> clientes y colaboradores</p>
      </div>
      <ul class="wall">
        {#each logos as l, i}
          <li style="--dx: {scatter[i].dx}vw; --dy: {scatter[i].dy}vh; --r: {scatter[i].r}deg; --s: {scatter[i].s}">
            <img src="/clients/{l.id}.webp" alt={l.name} loading="lazy" decoding="async" />
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<style>
  .clients { height: 260vh; }
  .head { display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; flex-wrap: wrap; margin-bottom: clamp(28px, 5vh, 56px); opacity: calc(0.25 + var(--t, 0) * 0.75); transform: translateY(calc((1 - var(--t, 0)) * 30px)); }
  .head .xs-h2 { font-size: clamp(34px, 4.6vw, 72px); max-width: 15ch; }
  .count { margin: 0; font-size: 15px; color: var(--xs-muted); }
  .count b { display: block; font-size: clamp(48px, 5vw, 80px); font-weight: 800; line-height: 1; letter-spacing: -0.04em; color: var(--xs-pink-2); font-variant-numeric: tabular-nums; }

  .wall { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: clamp(8px, 1vw, 14px); }
  .wall li {
    position: relative; min-width: 0; aspect-ratio: 2 / 1; border-radius: 14px; background: #fff; display: grid; place-items: center; padding: 10% 14%;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04), 0 20px 40px -24px rgba(0, 0, 0, 0.45);
    transform: translate3d(calc(var(--dx) * var(--k, 1)), calc(var(--dy) * var(--k, 1)), 0) rotate(calc(var(--r) * var(--k, 1))) scale(calc(1 + (var(--s) - 1) * var(--k, 1)));
    will-change: transform;
  }
  :global(.light) .wall li { box-shadow: 0 0 0 1px rgba(20, 16, 20, 0.08), 0 20px 40px -28px rgba(20, 16, 20, 0.35); }
  .wall img { position: absolute; inset: 12% 8%; width: 84%; height: 76%; object-fit: contain; transition: transform 0.5s var(--xs-ease); }
  .wall li:hover img { transform: scale(1.08); }

  @media (max-width: 900px) {
    .clients { height: 220vh; }
    .wall { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .wall li { border-radius: 10px; padding: 8% 10%; }
    .head { margin-bottom: 20px; }
  }
  @media (max-width: 520px) {
    .wall { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .wall li:nth-child(n + 19) { display: none; }
  }
</style>
