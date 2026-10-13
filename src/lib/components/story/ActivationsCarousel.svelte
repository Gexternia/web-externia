<script lang="ts">
  import { onMount } from 'svelte';
  import './story.css';
  import { reveal } from './reveal';

  const activations: { title: string; category: string; desc: string; ideal: string; image: string; link?: string }[] = [
    { title: 'Smart Brush', category: 'Transformación Creativa', desc: 'El asistente dibuja sobre una tableta y la IA transforma su trazo en una creación artística de alta calidad en tiempo real.', ideal: 'Stands en ferias, networking corporativo, lanzamientos de producto', image: '/activaciones/smart-brush.webp' },
    { title: 'RetroGame', category: 'Experiencia Gamificada', desc: 'Un tótem digital que convierte a la persona y su negocio en un videojuego, con portada descargable e imprimible y personajes jugables. Efecto WOW y recuerdo duradero.', ideal: 'Eventos empresariales, ferias PYME, teambuilding', image: '/activaciones/retrogame.webp', link: 'https://tu-pyme-el-videojuego-de-los-90-46874276291.us-west1.run.app/' },
    { title: 'ComicGen', category: 'Storytelling Visual', desc: 'Historias estilo novela gráfica en las que el asistente es el protagonista de su propia aventura heroica. En digital o impresas en mini revista.', ideal: 'Eventos corporativos, lanzamientos, ferias', image: '/activaciones/comicgen.webp', link: 'https://comicgen-totem-46874276291.us-west1.run.app/' },
    { title: 'NeoCard', category: 'Networking Digital', desc: 'Tarjetas de visita generadas con IA a partir de la voz o el texto del asistente. Se imprimen al momento con un QR vCard para compartir el contacto al instante.', ideal: 'Networking, ferias, congresos, eventos B2B', image: '/activaciones/neocard.webp', link: 'https://generador-tarjetas.onrender.com/' },
    { title: 'FXstylized', category: 'Personalización Visual', desc: 'El rostro del invitado convertido en blísters de juguete, tazas, latas, pósters o llaveros. Imágenes listas para compartir al instante y potenciar la viralidad.', ideal: 'Activaciones de marca, merchandising único, recuerdos personalizados', image: '/activaciones/fxstylized.webp' },
    { title: 'Profesi-O-Matic', category: 'Fotocall con IA', desc: 'Un fotocall que convierte a los asistentes en sus profesiones soñadas: eligen atrezzo, se fotografían y la IA genera su «yo profesional». Descarga y comparte.', ideal: 'Ferias, eventos corporativos, teambuilding, activaciones virales', image: '/activaciones/profesi-o-matic.webp', link: 'https://profesi-o-matic-46874276291.us-west1.run.app/' },
    { title: 'Mystic Oracle', category: 'Entretenimiento Personalizado', desc: 'Una pitonisa virtual que «predice» el futuro profesional del asistente de forma divertida e interactiva, con interacción por voz y consejos con humor.', ideal: 'Activaciones de marca, eventos temáticos, inauguraciones, cenas de gala', image: '/activaciones/mystic-oracle.webp', link: 'https://madame-gemini-pitonisa-virtual-46874276291.us-west1.run.app/' },
    { title: 'Carizaturízame', category: 'Entretenimiento Personalizado', desc: 'La IA redefine el arte de la caricatura con retratos humorísticos e hiperpersonalizados. Más de 2.300 caricaturas en un solo evento.', ideal: 'Ferias, eventos masivos, stands con alto tráfico de visitantes', image: '/activaciones/carizaturizame.webp' }
  ];
  const N = activations.length;
  const STEP = 360 / N;

  let stage: HTMLElement;
  let ring: HTMLElement;
  let cards: HTMLElement[] = [];
  let idx = $state(0);
  const a = $derived(activations[idx]);

  // rotation state (degrees); the front card is the one at -rot
  let rot = 0, target = 0, raf = 0, radius = 500;
  const mod = (n: number, m: number) => ((n % m) + m) % m;

  function render() {
    ring.style.transform = `translateZ(${-radius}px) rotateX(-9deg) rotateY(${rot}deg)`;
    cards.forEach((c, i) => {
      let d = mod(i * STEP + rot + 180, 360) - 180;          // angle from the front, -180..180
      const k = Math.min(1, Math.abs(d) / 180);
      c.style.setProperty('--dim', k.toFixed(3));
      c.style.zIndex = String(100 - Math.round(Math.abs(d)));
      c.style.pointerEvents = Math.abs(d) > 100 ? 'none' : '';
    });
    const front = mod(Math.round(-rot / STEP), N);
    if (front !== idx) idx = front;
  }
  function animate() {
    rot += (target - rot) * 0.12;
    render();
    raf = Math.abs(target - rot) > 0.05 ? requestAnimationFrame(animate) : (rot = target, render(), 0);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(animate); };

  function go(i: number) {
    // shortest way round to card i
    const cur = -target / STEP;
    let delta = mod(i - cur + N / 2, N) - N / 2;
    target = -(cur + Math.round(delta)) * STEP;
    kick();
  }
  const step = (d: number) => go(mod(idx + d, N));

  // drag
  let dragging = false, moved = 0, lastX = 0, vel = 0;
  function down(e: PointerEvent) {
    dragging = true; moved = 0; lastX = e.clientX; vel = 0;
    cancelAnimationFrame(raf); raf = 0;
    addEventListener('pointermove', move);
    addEventListener('pointerup', up, { once: true });
    addEventListener('pointercancel', up, { once: true });
  }
  function move(e: PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    moved += Math.abs(dx);
    vel = dx;
    rot += dx * (STEP / Math.max(160, stage.clientWidth * 0.32));
    target = rot;
    render();
  }
  function up() {
    removeEventListener('pointermove', move);
    if (!dragging) return;
    dragging = false;
    // a little inertia, then snap to the nearest card
    const fling = vel * (STEP / Math.max(160, stage.clientWidth * 0.32)) * 6;
    target = Math.round((rot + fling) / STEP) * STEP;
    kick();
  }
  function cardClick(i: number) {
    if (moved > 6) return;            // it was a drag, not a click
    go(i);
  }
  const key = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  onMount(() => {
    const size = () => {
      const w = cards[0]?.offsetWidth || 400;
      radius = Math.round((w / 2) / Math.tan(Math.PI / N) * 1.08);
      ring.style.setProperty('--r', `${radius}px`);
      render();
    };
    const ro = new ResizeObserver(size);
    ro.observe(stage);
    size();
    return () => { ro.disconnect(); cancelAnimationFrame(raf); removeEventListener('pointermove', move); };
  });
</script>

<section class="xs car" aria-label="Activaciones">
  <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i><span class="grid"></span></div>
  <div class="xs-wrap top" data-rv use:reveal>
    <h2 class="xs-h2">8 activaciones. <em>Gira y elige.</em></h2>
    <p class="xs-lead">Arrastra el carrusel, usa las flechas o pulsa cualquier tarjeta.</p>
  </div>

  <div class="layout">
  <div class="left">
  <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
  <div
    class="stage"
    bind:this={stage}
    role="region"
    aria-roledescription="carrusel"
    aria-label="Activación seleccionada: {a.title}"
    tabindex="0"
    onpointerdown={down}
    onkeydown={key}
  >
    <div class="ring" bind:this={ring}>
      {#each activations as x, i}
        <button
          class="card"
          class:on={i === idx}
          bind:this={cards[i]}
          style="transform: rotateY({i * STEP}deg) translateZ(var(--r, 500px))"
          onclick={() => cardClick(i)}
          tabindex="-1"
          aria-label="Ver {x.title}"
        >
          <img src={x.image} alt="" draggable="false" loading="lazy" decoding="async" />
          <span class="cap"><b>{String(i + 1).padStart(2, '0')}</b> {x.title}</span>
        </button>
      {/each}
    </div>
    <div class="floor" aria-hidden="true"></div>
  </div>

  <div class="xs-wrap controls">
    <button class="arrow" onclick={() => step(-1)} aria-label="Activación anterior">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
    </button>
    <div class="pips" role="tablist" aria-label="Activaciones">
      {#each activations as x, i}
        <button class="pip" class:on={i === idx} role="tab" aria-selected={i === idx} aria-label={x.title} onclick={() => go(i)}></button>
      {/each}
    </div>
    <button class="arrow" onclick={() => step(1)} aria-label="Siguiente activación">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
    </button>
  </div>

  </div>

  <div class="xs-wrap info" aria-live="polite">
    {#key idx}
      <div class="info-in">
        <div class="head">
          <span class="count"><b>{String(idx + 1).padStart(2, '0')}</b> / {String(N).padStart(2, '0')}</span>
          <span class="cat">{a.category}</span>
        </div>
        <h3>{a.title}</h3>
        <div class="cols">
          <p>{a.desc}</p>
          <div class="side">
            <p class="ideal"><b>Ideal para</b> {a.ideal}</p>
            {#if a.link}
              <a class="xs-btn cta" href={a.link} target="_blank" rel="noopener">Probar la demo <span aria-hidden="true">→</span></a>
            {:else}
              <a class="xs-btn xs-btn--ghost cta" href="/contacto">Quiero esta activación <span aria-hidden="true">→</span></a>
            {/if}
          </div>
        </div>
      </div>
    {/key}
  </div>
  </div>
</section>

<style>
  .car { padding: clamp(88px, 13vh, 150px) 0 clamp(72px, 10vh, 120px); overflow: hidden; }
  .top { text-align: center; }
  .top .xs-h2 { font-size: clamp(36px, 4.6vw, 72px); }
  .top .xs-lead { margin: 14px auto 0; }

  /* ---------- 3D stage ---------- */
  .stage { position: relative; height: clamp(340px, 40vw, 560px); margin-top: clamp(16px, 3vh, 32px); perspective: 1500px; perspective-origin: 50% 25%; cursor: grab; touch-action: pan-y; user-select: none; outline: none; }
  .stage:active { cursor: grabbing; }
  .stage:focus-visible { outline: 2px solid var(--xs-pink); outline-offset: -8px; border-radius: 24px; }
  .ring { position: absolute; left: 50%; top: 50%; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }
  .card {
    position: absolute; left: calc(var(--w) / -2); top: calc(var(--h) / -2);
    --w: clamp(250px, 33vw, 500px); --h: calc(var(--w) * 0.6);
    width: var(--w); height: var(--h); padding: 0; border: 0; border-radius: 20px; overflow: hidden; cursor: pointer;
    background: #110a0e;
    box-shadow: 0 40px 70px -40px rgba(0, 0, 0, 0.8);
    transition: box-shadow 0.4s;
  }
  .card img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; filter: brightness(calc(1 - var(--dim, 0) * 0.8)) saturate(calc(1 - var(--dim, 0) * 0.7)); }
  :global(.light) .card img { filter: brightness(calc(1 - var(--dim, 0) * 0.35)) saturate(calc(1 - var(--dim, 0) * 0.8)) opacity(calc(1 - var(--dim, 0) * 0.55)); }
  .card::after { content: ''; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 3px #d6007d; opacity: 0; transition: opacity 0.4s; }
  .card.on::after { opacity: 1; }
  .card.on .cap, .card:hover .cap { display: inline-flex; }
  .card.on { box-shadow: 0 50px 90px -40px rgba(214, 0, 125, 0.7); }
  .cap { position: absolute; left: 12px; bottom: 12px; display: none; display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 99px; background: rgba(0, 0, 0, 0.7); color: #fff; font-size: 13px; font-weight: 700; opacity: calc(1 - var(--dim, 0) * 1.4); }
  .cap b { color: #ff8cc0; }
  .floor { position: absolute; left: 15%; right: 15%; bottom: -6%; height: 60px; border-radius: 50%; background: radial-gradient(closest-side, rgba(214, 0, 125, 0.4), transparent); pointer-events: none; }
  :global(.light) .floor { background: radial-gradient(closest-side, rgba(214, 0, 125, 0.22), transparent); }

  /* ---------- controls ---------- */
  .controls { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: clamp(20px, 4vh, 40px); }
  .arrow { display: grid; place-items: center; width: 52px; height: 52px; border: 0; border-radius: 50%; background: var(--xs-card); color: var(--xs-ink); cursor: pointer; box-shadow: inset 0 0 0 1.5px var(--xs-line); transition: background 0.3s, color 0.3s, transform 0.3s var(--xs-ease), box-shadow 0.3s; }
  .arrow:hover { background: #d6007d; color: #fff; box-shadow: none; transform: scale(1.08); }
  .arrow svg { width: 20px; height: 20px; }
  .pips { display: flex; gap: 8px; }
  .pip { width: 10px; height: 10px; padding: 0; border: 0; border-radius: 99px; background: var(--xs-faint); cursor: pointer; transition: width 0.4s var(--xs-ease), background 0.3s; }
  .pip.on { width: 34px; background: var(--xs-brand); }

  /* ---------- info ---------- */
  .info { margin-top: clamp(28px, 5vh, 48px); min-height: 230px; }
  .info-in { max-width: 980px; margin: 0 auto; animation: infoIn 0.6s var(--xs-ease) both; }
  @keyframes infoIn { from { opacity: 0; transform: translateY(16px); } }
  .head { display: flex; align-items: center; gap: 16px; }
  .count { font-size: 14px; color: var(--xs-muted); }
  .count b { font-size: 22px; color: var(--xs-pink-2); }
  .cat { font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--xs-pink-2); }
  .info h3 { margin: 8px 0 0; font-size: clamp(36px, 4.2vw, 64px); font-weight: 800; line-height: 1; letter-spacing: -0.035em; }
  .cols { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px 48px; margin-top: 16px; align-items: start; }
  .cols > p { margin: 0; font-size: clamp(16px, 1.25vw, 19px); line-height: 1.6; color: var(--xs-muted); }
  .ideal { margin: 0; font-size: 14px; line-height: 1.5; color: var(--xs-muted); }
  .ideal b { display: block; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--xs-ink); }
  .cta { margin-top: 18px; padding: 14px 24px; font-size: 15px; }

  /* desktop: carousel on the left, description on the right */
  @media (min-width: 901px) {
    .layout { display: grid; grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr); align-items: center; max-width: 1560px; margin: 0 auto; padding: 0 clamp(16px, 3vw, 40px); }
    .left { min-width: 0; }
    .stage { height: clamp(380px, 36vw, 600px); }
    .card { --w: clamp(300px, 27vw, 460px); }
    .info { margin-top: 0; padding: 0 0 0 clamp(16px, 2vw, 40px); min-height: 0; position: relative; z-index: 2; }
    .info-in { max-width: 460px; margin: 0; }
    .cols { grid-template-columns: 1fr; gap: 18px; }
  }

  @media (max-width: 900px) {
    .stage { height: 82vw; }
    .card { --w: 78vw; }
    .cols { grid-template-columns: 1fr; }
    .arrow { width: 44px; height: 44px; }
    .pips { gap: 6px; }
  }
</style>
