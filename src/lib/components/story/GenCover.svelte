<script lang="ts">
  /** A generative cover built from the Externia "E" grammar (bars + dot), seeded by a string. */
  interface Props { seed: string; num?: string; tall?: boolean }
  let { seed, num = '', tall = false }: Props = $props();

  // small deterministic PRNG from the seed
  const rng = $derived.by(() => {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  });

  const palettes = [
    ['#FFC12D', '#F7A361', '#EE847B', '#DE3B84', '#D6007D'],
    ['#D6007D', '#DE3B84', '#EE847B'],
    ['#F7A361', '#FFC12D', '#EE847B'],
    ['#DE3B84', '#D6007D', '#FFC12D']
  ];

  const art = $derived.by(() => {
    const r = rng;
    const pal = palettes[Math.floor(r() * palettes.length)];
    const angle = [0, 0, -12, 12, 90, -30][Math.floor(r() * 6)];
    const count = 3 + Math.floor(r() * 4);
    const bars = Array.from({ length: count }, (_, i) => ({
      x: r() * 40 - 10,
      y: 10 + (i / count) * 80 + r() * 6,
      w: 35 + r() * 75,
      h: 7 + r() * 9,
      c1: pal[Math.floor(r() * pal.length)],
      c2: pal[Math.floor(r() * pal.length)],
      d: (i * 0.09).toFixed(2)
    }));
    const dot = { x: 55 + r() * 35, y: 15 + r() * 70, s: 10 + r() * 14 };
    const bg = r() > 0.5 ? 'dark' : 'ink';
    return { angle, bars, dot, bg };
  });
</script>

<div class="cover {art.bg}" class:tall aria-hidden="true">
  <div class="art" style="transform: rotate({art.angle}deg) scale({Math.abs(art.angle) === 90 ? 1.35 : 1.15})">
    {#each art.bars as b}
      <span class="bar" style="left: {b.x}%; top: {b.y}%; width: {b.w}%; height: {b.h}%; background: linear-gradient(90deg, {b.c1}, {b.c2}); --d: {b.d}s"></span>
    {/each}
    <span class="dot" style="left: {art.dot.x}%; top: {art.dot.y}%; width: {art.dot.s}%;"></span>
  </div>
  <span class="grain"></span>
  {#if num}<span class="num">{num}</span>{/if}
</div>

<style>
  .cover { position: relative; aspect-ratio: 4 / 3; overflow: hidden; border-radius: inherit; background: #0b0609; isolation: isolate; }
  .cover.tall { aspect-ratio: 3 / 4; }
  .cover.ink { background: radial-gradient(120% 90% at 20% 0%, #3a0a25, #0b0609 60%); }
  .art { position: absolute; inset: 0; transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
  .bar { position: absolute; border-radius: 4px; transform-origin: left; transform: scaleX(0.9); transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: var(--d); box-shadow: 0 10px 30px -10px rgba(214, 0, 125, 0.55); }
  .dot { position: absolute; aspect-ratio: 1; border-radius: 50%; background: #d6007d; box-shadow: 0 0 0 0 rgba(214, 0, 125, 0.4); transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
  :global(a:hover) > .cover .bar, :global(a:focus-visible) > .cover .bar { transform: scaleX(1.12); }
  :global(a:hover) > .cover .dot { transform: scale(1.25); }
  .grain { position: absolute; inset: 0; opacity: 0.16; mix-blend-mode: overlay; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
  .num { position: absolute; right: 14px; bottom: 6px; font-size: clamp(40px, 5vw, 80px); font-weight: 800; letter-spacing: -0.05em; line-height: 1; color: rgba(255, 255, 255, 0.92); text-shadow: 0 6px 30px rgba(0, 0, 0, 0.45) !important; }
</style>
