<script lang="ts">
  import PageHero from '$lib/components/story/PageHero.svelte';
  import Roadmap from '$lib/components/story/Roadmap.svelte';
  import CtaClose from '$lib/components/story/CtaClose.svelte';
  import { reveal, viewProgress } from '$lib/components/story/reveal';
  import '$lib/components/story/story.css';

  const phases = [
    { num: '01', title: 'CRE-IA-tividad', desc: 'Exploración del contexto del evento, los objetivos de la marca y el perfil de los asistentes. Co-creación mediante brainstorming aumentado con IA.' },
    { num: '02', title: 'AI-mplementación', desc: 'Desarrollo e integración ágil de la solución elegida. La tecnología se adapta al espacio, el tiempo y el equipo humano del evento.' },
    { num: '03', title: 'Evolución y Optimización', desc: 'Monitorización en tiempo real, feedback e informes de impacto medibles. Auditorías de IA y asesoramiento en la Ley de IA de la UE.' }
  ];
  const extras = ['Auditorías de IA', 'Hojas de ruta tecnológicas', 'Cumplimiento Ley IA UE', 'Soluciones neutras en carbono'];

  const notes = [
    { t: 'Contexto del evento', x: 4, y: 8, r: -6, c: 'w' },
    { t: 'Objetivos de marca', x: 46, y: 0, r: 4, c: 'p' },
    { t: 'Perfil de asistentes', x: 30, y: 34, r: -2, c: 'y' },
    { t: 'Brainstorming', x: 0, y: 60, r: 5, c: 'w' },
    { t: '+ IA', x: 64, y: 40, r: -8, c: 'p' },
    { t: 'Co-creación', x: 44, y: 72, r: 3, c: 'w' }
  ];
  const chart = 'M0,86 C20,84 30,70 45,72 C60,74 70,52 85,54 C100,56 110,36 125,34 C140,32 150,22 165,14 C175,9 185,8 200,4';
</script>

<PageHero
  title={'Consultoría\nestratégica de IA'}
  accent="IA"
  lead="Para agencias y empresas que quieren que la IA sea una ventaja de verdad en sus eventos."
  ctas={[{ href: '/contacto', label: 'Hablemos' }, { href: '#ruta', label: 'Ver la hoja de ruta', ghost: true }]}
/>

<!-- "Integración real, no genérica" — the word gets struck through as you scroll -->
<section class="xs strike" use:viewProgress>
  <div class="xs-wrap">
    <h2 class="big">Integración real, <span class="no">no <span class="gen">genérica<i aria-hidden="true"></i></span>.</span></h2>
    <p class="sub" data-rv use:reveal>Diseñada específicamente para el sector de los eventos, con el conocimiento de quienes lo conocen desde dentro.</p>
  </div>
</section>

<div id="ruta">
  <Roadmap stops={phases} {extras} heading="Tu hoja de ruta con IA, paso a paso.">
    {#snippet visual(i)}
      {#if i === 0}
        <div class="notes">
          {#each notes as n, k}
            <span class="note {n.c}" style="left: {n.x}%; top: {n.y}%; --r: {n.r}deg; --k: {k}; --fx: {(k % 2 ? 1 : -1) * (40 + k * 12)}px; --fy: {60 + k * 10}px">{n.t}</span>
          {/each}
        </div>
      {:else if i === 1}
        <div class="build">
          <div class="E">
            <span class="bar b1"></span><span class="bar b2"></span><span class="bar b3"></span><span class="dot"></span>
          </div>
          <ul class="tags">
            <li style="--k: 0">Espacio</li><li style="--k: 1">Tiempo</li><li style="--k: 2">Equipo humano</li>
          </ul>
        </div>
      {:else}
        <div class="dash">
          <div class="dash-top"><span class="live"></span> Monitorización en tiempo real</div>
          <svg viewBox="0 0 200 90" class="chart" preserveAspectRatio="none">
            <path d="{chart} L200,90 L0,90 Z" class="area" />
            <path d={chart} class="ln" />
          </svg>
          <div class="chips"><span style="--k: 0">Feedback</span><span style="--k: 1">Informe de impacto</span><span style="--k: 2">Auditoría de IA</span><span style="--k: 3">Ley de IA UE</span></div>
        </div>
      {/if}
    {/snippet}
  </Roadmap>
</div>

<CtaClose
  title="Integremos la IA en tu estrategia."
  accent="IA"
  text="Cuéntanos tu proyecto y te acompañamos en la integración estratégica de la IA."
/>

<style>
  .strike { padding: clamp(110px, 20vh, 220px) 0; overflow: hidden; }
  .big { margin: 0; font-size: clamp(44px, 8vw, 132px); font-weight: 800; line-height: 0.95; letter-spacing: -0.045em; max-width: 14ch; }
  .no { color: var(--xs-muted); }
  .gen { position: relative; display: inline-block; }
  .gen i {
    position: absolute; left: -2%; right: -2%; top: 52%; height: 0.16em; border-radius: 4px; background: var(--xs-brand);
    transform-origin: left; transform: scaleX(clamp(0, calc((var(--vp, 0) - 0.3) * 4), 1)) rotate(-3deg);
  }
  .sub { margin: clamp(28px, 5vh, 48px) 0 0; max-width: 48ch; font-size: clamp(18px, 1.6vw, 24px); line-height: 1.55; color: var(--xs-muted); }

  /* 01 · brainstorm notes */
  .notes { position: absolute; inset: 0; }
  .note { position: absolute; padding: 14px 18px; border-radius: 12px; font-size: clamp(14px, 1.15vw, 17px); font-weight: 800; white-space: nowrap; box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.55); opacity: 0; transform: translate(var(--fx), var(--fy)) rotate(calc(var(--r) * 3)) scale(0.7); transition: opacity 0.6s ease, transform 1.1s cubic-bezier(0.34, 1.56, 0.64, 1); transition-delay: calc(var(--k) * 90ms); }
  .note.w { background: var(--xs-card); color: var(--xs-ink); box-shadow: inset 0 0 0 1px var(--xs-line), 0 20px 40px -24px rgba(0, 0, 0, 0.5); }
  .note.p { background: #d6007d; color: #fff; }
  .note.y { background: #ffc12d; color: #2a1406; }
  :global(.on) .note { opacity: 1; transform: rotate(var(--r)); animation: float 6s ease-in-out calc(1.2s + var(--k) * 0.4s) infinite; }
  @keyframes float { 50% { transform: rotate(var(--r)) translateY(-8px); } }

  /* 02 · the E snaps together */
  .build { position: absolute; inset: 0; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 28px; }
  .E { position: relative; width: 100%; aspect-ratio: 32 / 25; }
  .bar { position: absolute; left: 0; height: 20%; border-radius: 6px; background: var(--xs-brand); opacity: 0; transition: transform 1s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.5s ease; }
  .b1 { top: 0; width: 100%; transform: translate(-60%, -40%) rotate(-12deg); }
  .b2 { top: 40%; width: 68.75%; transform: translate(80%, 10%) rotate(10deg); transition-delay: 0.15s; }
  .b3 { top: 80%; width: 100%; transform: translate(-40%, 60%) rotate(8deg); transition-delay: 0.3s; }
  .E .dot { position: absolute; right: 0; top: 40%; width: 15.6%; aspect-ratio: 1; border-radius: 50%; background: #d6007d; transform: translate(6%, -260%) scale(0.4); opacity: 0; transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s, opacity 0.3s ease 0.6s; }
  :global(.on) .bar { opacity: 1; transform: none; }
  :global(.on) .E .dot { opacity: 1; transform: translate(6%, 0) scale(1); }
  .tags { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
  .tags li { padding: 10px 16px; border-radius: 99px; font-size: 15px; font-weight: 800; box-shadow: inset 0 0 0 1.5px var(--xs-pink); color: var(--xs-pink-2); opacity: 0; transform: translateX(20px); transition: opacity 0.5s ease, transform 0.7s var(--xs-ease); transition-delay: calc(0.9s + var(--k) * 0.12s); white-space: nowrap; }
  :global(.on) .tags li { opacity: 1; transform: none; }

  /* 03 · live monitoring */
  .dash { position: absolute; inset: 6% 0; border-radius: 24px; padding: clamp(18px, 2vw, 28px); background: var(--xs-card); box-shadow: inset 0 0 0 1px var(--xs-line), 0 40px 80px -40px rgba(0, 0, 0, 0.6); display: flex; flex-direction: column; }
  :global(.light) .dash { box-shadow: inset 0 0 0 1px var(--xs-line), 0 40px 80px -50px rgba(20, 16, 20, 0.35); }
  .dash-top { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--xs-muted); }
  .live { width: 10px; height: 10px; border-radius: 50%; background: #d6007d; animation: live 1.4s ease-in-out infinite; }
  @keyframes live { 50% { box-shadow: 0 0 0 6px rgba(214, 0, 125, 0.2); } }
  .chart { flex: 1; width: 100%; margin: 14px 0; }
  .chart .ln { fill: none; stroke: url(#road-grad); stroke-width: 3; stroke-linecap: round; vector-effect: non-scaling-stroke; stroke-dasharray: 400; stroke-dashoffset: 400; transition: stroke-dashoffset 2s var(--xs-ease); }
  .chart .area { fill: rgba(222, 59, 132, 0.12); opacity: 0; transition: opacity 1s ease 0.8s; }
  :global(.on) .chart .ln { stroke-dashoffset: 0; }
  :global(.on) .chart .area { opacity: 1; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .chips span { padding: 7px 12px; border-radius: 99px; font-size: 13px; font-weight: 700; background: var(--xs-bg-2); box-shadow: inset 0 0 0 1px var(--xs-line); opacity: 0; transform: translateY(10px); transition: opacity 0.5s ease, transform 0.6s var(--xs-ease); transition-delay: calc(1s + var(--k) * 0.12s); }
  :global(.on) .chips span { opacity: 1; transform: none; }

  @media (max-width: 900px) {
    .note { padding: 10px 12px; font-size: 13px; }
    .build { grid-template-columns: 1fr; gap: 16px; }
    .E { width: 70%; }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; }
  }
</style>
