<script lang="ts">
  import Roadmap from './Roadmap.svelte';

  const timeline = [
    { num: '2021', title: 'La ciencia', desc: 'Guillermo lee su tesis doctoral donde aplica todo el potencial de la IA para predecir eficacia en tratamientos oncológicos en el Hospital La Paz.' },
    { num: '2023', title: 'El sector', desc: 'Aprende cómo funciona el MICE desde dentro de una agencia en la que se desarrolla como el primer Prompt Engineer del sector.' },
    { num: '2024', title: 'Nace Externia', desc: 'Funda Externia. En menos de 2 meses ya colabora con 5 de las principales agencias de eventos de España y proyectos para clientes del IBEX 35.' },
    { num: '2025', title: 'El reconocimiento', desc: 'Ganador del premio Event Industry Entrepreneur y finalista del Innovation Champion en los MPI Iberian Awards — Valencia.' }
  ];

  // 2021 · a neural network drawn with deterministic nodes
  const nodes = Array.from({ length: 22 }, (_, i) => {
    const a = i * 2.39996, r = 18 + (i * 37) % 70;
    return { x: 120 + Math.cos(a) * r * 1.4, y: 100 + Math.sin(a) * r * 0.95, s: 2.5 + (i % 4) };
  });
  const links: [number, number][] = [];
  nodes.forEach((n, i) => nodes.forEach((m, j) => { if (j > i && Math.hypot(n.x - m.x, n.y - m.y) < 52) links.push([i, j]); }));
</script>

<Roadmap stops={timeline} heading="De la ciencia oncológica a revolucionar los eventos.">
  {#snippet visual(i)}
    {#if i === 0}
      <!-- 2021 · IA aplicada a la ciencia -->
      <div class="m">
        <svg viewBox="0 0 240 200" class="net">
          {#each links as [a, b], k}
            <line x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} style="--k: {k}" />
          {/each}
          {#each nodes as n, k}
            <circle cx={n.x} cy={n.y} r={n.s} style="--k: {k}" />
          {/each}
        </svg>
        <span class="cap">Tesis doctoral · IA aplicada a oncología · Hospital La Paz</span>
      </div>
    {:else if i === 1}
      <!-- 2023 · the first Prompt Engineer of the sector: an event credential -->
      <div class="m">
        <div class="lanyard">
          <span class="strap"></span>
          <div class="badge">
            <span class="clip"></span>
            <div class="b-top">
              <span class="mini-e"><i></i><i></i><i></i></span>
              <span>Sector MICE · 2023</span>
            </div>
            <span class="b-role">Prompt<br />Engineer</span>
            <span class="b-name">Guillermo Prado</span>
            <span class="b-tag">El primero del sector</span>
            <span class="b-code"></span>
          </div>
        </div>
      </div>
    {:else if i === 2}
      <!-- 2024 · Externia is born: its first activations -->
      <div class="m fan">
        <img src="/activaciones/smart-brush.webp" alt="" loading="lazy" decoding="async" />
        <img src="/activaciones/comicgen.webp" alt="" loading="lazy" decoding="async" />
        <img src="/activaciones/neocard.webp" alt="" loading="lazy" decoding="async" />
        <span class="cap">Las primeras activaciones de Externia</span>
      </div>
    {:else}
      <!-- 2025 · MPI Iberian Awards -->
      <div class="m fan tall">
        <img src="/team/equipo-mpi-sm.webp" alt="" loading="lazy" decoding="async" />
        <img src="/team/guillermo-premio-sm.webp" alt="" loading="lazy" decoding="async" />
        <img src="/team/guillermo-ganador-sm.webp" alt="" loading="lazy" decoding="async" />
        <span class="cap">MPI Iberian Awards · Valencia 2025</span>
      </div>
    {/if}
  {/snippet}
</Roadmap>

<style>
  .m { position: absolute; inset: 0; }
  .cap { position: absolute; left: 0; bottom: -10px; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; color: var(--xs-muted); opacity: 0; transition: opacity 0.6s ease 0.8s; }
  :global(.on) .cap { opacity: 1; }

  /* 2021 · network draws itself */
  .net { position: absolute; inset: 0 0 30px; width: 100%; height: calc(100% - 30px); }
  .net line { stroke: url(#road-grad); stroke-width: 0.8; stroke-dasharray: 80; stroke-dashoffset: 80; opacity: 0.85; transition: stroke-dashoffset 1.4s var(--xs-ease); transition-delay: calc(var(--k) * 12ms); }
  .net circle { fill: #de3b84; transform-box: fill-box; transform-origin: center; transform: scale(0); transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); transition-delay: calc(var(--k) * 30ms + 200ms); }
  .net circle:nth-child(3n) { fill: #ffc12d; }
  :global(.on) .net line { stroke-dashoffset: 0; }
  :global(.on) .net circle { transform: scale(1); }

  /* 2023 · credential swings in on its lanyard */
  .lanyard { position: absolute; left: 50%; top: -10%; width: min(300px, 62%); transform-origin: 50% 0; transform: translateX(-50%) rotate(16deg) translateY(-30px); opacity: 0; transition: transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease; }
  :global(.on) .lanyard { opacity: 1; transform: translateX(-50%) rotate(0deg); animation: sway 5s ease-in-out 1.6s infinite; }
  @keyframes sway { 0%, 100% { transform: translateX(-50%) rotate(0deg); } 50% { transform: translateX(-50%) rotate(-2.2deg); } }
  .strap { display: block; width: 26px; height: 90px; margin: 0 auto; background: repeating-linear-gradient(180deg, #de3b84 0 14px, #d6007d 14px 28px); border-radius: 0 0 4px 4px; }
  .badge { position: relative; margin-top: -4px; border-radius: 22px; padding: 30px 26px 24px; background: var(--xs-card); box-shadow: inset 0 0 0 1px var(--xs-line), 0 40px 80px -36px rgba(0, 0, 0, 0.7); overflow: hidden; }
  :global(.light) .badge { box-shadow: inset 0 0 0 1px var(--xs-line), 0 40px 80px -46px rgba(20, 16, 20, 0.35); }
  .badge::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 8px; background: var(--xs-brand); }
  .clip { position: absolute; left: 50%; top: 14px; width: 56px; height: 10px; margin-left: -28px; border-radius: 6px; background: var(--xs-bg-2); box-shadow: inset 0 0 0 1px var(--xs-line); }
  .b-top { display: flex; align-items: center; gap: 10px; margin-top: 14px; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--xs-muted); }
  .mini-e { position: relative; width: 22px; height: 17px; }
  .mini-e i { position: absolute; left: 0; height: 3px; border-radius: 1px; background: var(--xs-brand); }
  .mini-e i:nth-child(1) { top: 0; width: 100%; }
  .mini-e i:nth-child(2) { top: 7px; width: 69%; }
  .mini-e i:nth-child(3) { top: 14px; width: 100%; }
  .b-role { display: block; margin-top: 22px; font-size: clamp(34px, 3.2vw, 48px); font-weight: 800; line-height: 0.95; letter-spacing: -0.04em; }
  .b-name { display: block; margin-top: 18px; font-size: 17px; font-weight: 700; }
  .b-tag { display: inline-block; margin-top: 8px; padding: 5px 12px; border-radius: 99px; font-size: 12px; font-weight: 800; color: #fff; background: #d6007d; }
  .b-code { display: block; height: 26px; margin-top: 22px; background: repeating-linear-gradient(90deg, var(--xs-ink) 0 2px, transparent 2px 5px, var(--xs-ink) 5px 6px, transparent 6px 9px); opacity: 0.35; border-radius: 2px; }

  /* 2024 / 2025 · photo fans deal themselves out */
  .fan img { position: absolute; width: 62%; aspect-ratio: 1024 / 540; object-fit: cover; border-radius: 16px; box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.7); opacity: 0; transform: translateY(60px) rotate(0deg) scale(0.9); transition: transform 1.1s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.5s ease; }
  .fan img:nth-child(1) { left: 0; top: 4%; }
  .fan img:nth-child(2) { left: 19%; top: 24%; z-index: 2; transition-delay: 0.12s; }
  .fan img:nth-child(3) { right: 0; top: 46%; z-index: 3; transition-delay: 0.24s; }
  :global(.on) .fan img { opacity: 1; }
  :global(.on) .fan img:nth-child(1) { transform: rotate(-6deg); }
  :global(.on) .fan img:nth-child(2) { transform: rotate(2deg); }
  :global(.on) .fan img:nth-child(3) { transform: rotate(5deg); }
  .tall img { width: 34%; aspect-ratio: 3 / 4; object-position: top; }
  .tall img:nth-child(1) { left: 2%; top: 10%; width: 40%; }
  .tall img:nth-child(2) { left: 33%; top: 0; }
  .tall img:nth-child(3) { right: 0; left: auto; top: 14%; }
  .fan img:hover { transform: rotate(0) scale(1.05) !important; z-index: 5; }

  @media (max-width: 900px) {
    .lanyard { width: 220px; top: -4%; }
    .strap { height: 50px; }
    .badge { padding: 22px 18px 16px; }
    .b-role { font-size: 28px; margin-top: 12px; }
    .b-code { display: none; }
    .cap { display: none; }
  }
</style>
