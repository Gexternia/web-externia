<script lang="ts">
  import { onMount } from 'svelte';
  import './story.css';
  import { reveal } from './reveal';

  const activations: { title: string; category: string; desc: string; ideal: string; image: string; pos: string; link?: string }[] = [
    { title: 'Smart Brush', category: 'Transformación Creativa', desc: 'El asistente dibuja sobre una tableta y la IA transforma su trazo en una creación artística de alta calidad en tiempo real.', ideal: 'Stands en ferias, networking corporativo, lanzamientos de producto', image: '/activaciones/smart-brush.webp', pos: '50% 30%' },
    { title: 'RetroGame', category: 'Experiencia Gamificada', desc: 'Un tótem digital que convierte a la persona y su negocio en un videojuego, con portada descargable e imprimible y personajes jugables. Efecto WOW y recuerdo duradero.', ideal: 'Eventos empresariales, ferias PYME, teambuilding', image: '/activaciones/retrogame.webp', pos: '50% 40%', link: 'https://tu-pyme-el-videojuego-de-los-90-46874276291.us-west1.run.app/' },
    { title: 'ComicGen', category: 'Storytelling Visual', desc: 'Historias estilo novela gráfica en las que el asistente es el protagonista de su propia aventura heroica. En digital o impresas en mini revista.', ideal: 'Eventos corporativos, lanzamientos, ferias', image: '/activaciones/comicgen.webp', pos: '50% 40%', link: 'https://comicgen-totem-46874276291.us-west1.run.app/' },
    { title: 'NeoCard', category: 'Networking Digital', desc: 'Tarjetas de visita generadas con IA a partir de la voz o el texto del asistente. Se imprimen al momento con un QR vCard para compartir el contacto al instante.', ideal: 'Networking, ferias, congresos, eventos B2B', image: '/activaciones/neocard.webp', pos: '35% 50%', link: 'https://generador-tarjetas.onrender.com/' },
    { title: 'FXstylized', category: 'Personalización Visual', desc: 'El rostro del invitado convertido en blísters de juguete, tazas, latas, pósters o llaveros. Imágenes listas para compartir al instante y potenciar la viralidad.', ideal: 'Activaciones de marca, merchandising único, recuerdos personalizados', image: '/activaciones/fxstylized.webp', pos: '50% 40%' },
    { title: 'Profesi-O-Matic', category: 'Fotocall con IA', desc: 'Un fotocall que convierte a los asistentes en sus profesiones soñadas: eligen atrezzo, se fotografían y la IA genera su «yo profesional». Descarga y comparte.', ideal: 'Ferias, eventos corporativos, teambuilding, activaciones virales', image: '/activaciones/profesi-o-matic.webp', pos: '50% 35%', link: 'https://profesi-o-matic-46874276291.us-west1.run.app/' },
    { title: 'Mystic Oracle', category: 'Entretenimiento Personalizado', desc: 'Una pitonisa virtual que «predice» el futuro profesional del asistente de forma divertida e interactiva, con interacción por voz y consejos con humor.', ideal: 'Activaciones de marca, eventos temáticos, inauguraciones, cenas de gala', image: '/activaciones/mystic-oracle.webp', pos: '50% 35%', link: 'https://madame-gemini-pitonisa-virtual-46874276291.us-west1.run.app/' },
    { title: 'Carizaturízame', category: 'Entretenimiento Personalizado', desc: 'La IA redefine el arte de la caricatura con retratos humorísticos e hiperpersonalizados. Más de 2.300 caricaturas en un solo evento.', ideal: 'Ferias, eventos masivos, stands con alto tráfico de visitantes', image: '/activaciones/carizaturizame.webp', pos: '45% 40%' }
  ];
  const N = activations.length;
  const STEP = 360 / N;

  // a deterministic QR-like pattern for the "done" screen
  const qr = Array.from({ length: 81 }, (_, i) => {
    const x = i % 9, y = Math.floor(i / 9);
    if ((x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5)) return !((x === 1 || x === 7) && (y === 1 || y === 7));
    return Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1 > 0.45;
  });

  let stage: HTMLElement;
  let ring: HTMLElement;
  let cards: HTMLElement[] = [];
  let idx = $state(0);          // card at the front of the ring
  let shown = $state(0);        // activation loaded in the totem
  let run = $state(0);          // restarts the screen sequence
  let spinning = $state(false);
  let started = $state(false);
  const a = $derived(activations[shown]);

  let rot = 0, target = 0, raf = 0, radius = 520;
  const mod = (n: number, m: number) => ((n % m) + m) % m;

  function render() {
    ring.style.transform = `translateZ(${-radius}px) rotateX(-10deg) rotateY(${rot}deg)`;
    cards.forEach((c, i) => {
      const d = mod(i * STEP + rot + 180, 360) - 180;          // angle from the front
      const ad = Math.abs(d);
      c.style.setProperty('--dim', Math.min(1, ad / 180).toFixed(3));
      // the card at the front slides into the totem
      c.style.setProperty('--in', Math.max(0, 1 - ad / (STEP * 0.7)).toFixed(3));
      c.style.pointerEvents = ad < STEP * 0.5 || ad > 140 ? 'none' : '';
    });
    const front = mod(Math.round(-rot / STEP), N);
    if (front !== idx) idx = front;
  }
  function load() {
    spinning = false;
    if (shown !== idx || !started) { shown = idx; run++; started = true; }
  }
  function animate() {
    rot += (target - rot) * 0.12;
    render();
    if (Math.abs(target - rot) > 0.05) raf = requestAnimationFrame(animate);
    else { rot = target; render(); raf = 0; load(); }
  }
  const kick = () => { spinning = true; if (!raf) raf = requestAnimationFrame(animate); };

  function go(i: number) {
    const cur = -target / STEP;
    const delta = mod(i - cur + N / 2, N) - N / 2;
    target = -(cur + Math.round(delta)) * STEP;
    kick();
  }
  const step = (d: number) => go(mod(idx + d, N));

  // drag to spin
  let dragging = false, moved = 0, lastX = 0, vel = 0;
  const k = () => STEP / Math.max(160, stage.clientWidth * 0.26);
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
    moved += Math.abs(dx); vel = dx;
    if (moved > 4) spinning = true;
    rot += dx * k(); target = rot;
    render();
  }
  function up() {
    removeEventListener('pointermove', move);
    if (!dragging) return;
    dragging = false;
    target = Math.round((rot + vel * k() * 6) / STEP) * STEP;
    kick();
  }
  const cardClick = (i: number) => { if (moved <= 6) go(i); };
  const key = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  };

  onMount(() => {
    activations.forEach((x) => { const im = new Image(); im.decoding = 'async'; im.src = x.image; });
    const size = () => {
      const w = cards[0]?.offsetWidth || 300;
      radius = Math.round((w / 2) / Math.tan(Math.PI / N) * (innerWidth < 900 ? 1.35 : 1.3));
      ring.style.setProperty('--r', `${radius}px`);
      render();
    };
    const ro = new ResizeObserver(size);
    ro.observe(stage);
    size();
    // switch the totem on the first time it comes into view
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { load(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(stage);
    return () => { ro.disconnect(); io.disconnect(); cancelAnimationFrame(raf); removeEventListener('pointermove', move); };
  });
</script>

<section class="xs orb" aria-label="Activaciones">
  <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i><span class="grid"></span></div>
  <div class="xs-wrap top" data-rv use:reveal>
    <h2 class="xs-h2">Gira el tótem. <em>Elige tu experiencia.</em></h2>
    <p class="xs-lead">Arrastra para hacer girar las 8 activaciones. La que llega al frente entra en el tótem y se pone en marcha.</p>
  </div>

  <div class="layout">
  <div class="left">
  <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -->
  <div class="stage" bind:this={stage} role="region" aria-roledescription="carrusel" aria-label="Activación en el tótem: {a.title}" tabindex="0" onpointerdown={down} onkeydown={key}>
    <!-- orbiting cards -->
    <div class="ring" bind:this={ring}>
      {#each activations as x, i}
        <button class="card" bind:this={cards[i]} style="transform: rotateY({i * STEP}deg) translateZ(var(--r, 520px))" onclick={() => cardClick(i)} tabindex="-1" aria-label="Cargar {x.title} en el tótem">
          <img src={x.image} alt="" draggable="false" loading="lazy" decoding="async" />
          <span class="cap"><b>{String(i + 1).padStart(2, '0')}</b> {x.title}</span>
        </button>
      {/each}
    </div>

    <!-- the totem, in the middle of the orbit -->
    <div class="totem" aria-hidden="true">
      <div class="bezel">
        <div class="screen">
          {#if !started}
            <div class="off"><span class="be"><i></i><i></i><i></i><b></b></span></div>
          {:else}
            {#key run}
              <div class="seq">
                <div class="boot"><span class="be"><i></i><i></i><i></i><b></b></span></div>
                <div class="bar"><span>Externia</span><span>Activación {String(shown + 1).padStart(2, '0')}</span></div>
                <div class="media">
                  <img src={a.image} alt="" style="object-position: {a.pos}" />
                  <span class="scan"></span>
                </div>
                <div class="ui">
                  <span class="s-cat">{a.category}</span>
                  <span class="s-title">{a.title}</span>
                  <div class="gen"><span class="gen-l">Generando con IA…</span><span class="gen-bar"><i></i></span></div>
                  <div class="done">
                    <span class="qr">{#each qr as on}<i class:on></i>{/each}</span>
                    <span class="done-t"><b>¡Listo!</b> Escanea y llévatelo</span>
                  </div>
                </div>
              </div>
            {/key}
          {/if}
          <div class="selecting" class:on={spinning}>
            <span class="noise"></span>
            <span class="sel-t">Seleccionando…</span>
            <span class="sel-n">{String(idx + 1).padStart(2, '0')} · {activations[idx].title}</span>
          </div>
        </div>
      </div>
      <div class="chin"><span class="logo"><i></i><i></i><i></i><b></b></span></div>
      <div class="foot"></div>
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
    {#key shown}
      <div class="info-in">
        <div class="head">
          <span class="count"><b>{String(shown + 1).padStart(2, '0')}</b> / {String(N).padStart(2, '0')}</span>
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
  .orb { padding: clamp(88px, 13vh, 150px) 0 clamp(72px, 10vh, 120px); overflow: hidden; }
  .top { text-align: center; }
  .top .xs-h2 { font-size: clamp(34px, 4.4vw, 68px); }
  .top .xs-lead { margin: 14px auto 0; }

  /* ---------- stage: orbit + totem ---------- */
  .stage { --tw: clamp(210px, 20vw, 290px); position: relative; height: calc(var(--tw) * 1.86 + 110px); margin-top: clamp(20px, 4vh, 40px); perspective: 1600px; perspective-origin: 50% 30%; cursor: grab; touch-action: pan-y; user-select: none; outline: none; }
  .stage:active { cursor: grabbing; }
  .stage:focus-visible { outline: 2px solid var(--xs-pink); outline-offset: -8px; border-radius: 24px; }
  .ring { position: absolute; left: 50%; top: 44%; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; z-index: 1; }
  .card {
    --w: clamp(200px, 20vw, 300px); --h: calc(var(--w) * 0.62);
    position: absolute; left: calc(var(--w) / -2); top: calc(var(--h) / -2); width: var(--w); height: var(--h);
    padding: 0; border: 0; border-radius: 16px; overflow: hidden; cursor: pointer; background: #110a0e;
    box-shadow: 0 30px 60px -34px rgba(0, 0, 0, 0.8);
    opacity: calc(1 - var(--in, 0));
  }
  .card img { width: 100%; height: 100%; object-fit: cover; pointer-events: none; filter: brightness(calc(1 - var(--dim, 0) * 0.75)) saturate(calc(1 - var(--dim, 0) * 0.6)); }
  :global(.light) .card img { filter: brightness(calc(1 - var(--dim, 0) * 0.3)) saturate(calc(1 - var(--dim, 0) * 0.8)) opacity(calc(1 - var(--dim, 0) * 0.5)); }
  .card:hover img { filter: none; }
  .cap { position: absolute; left: 10px; bottom: 10px; display: inline-flex; gap: 6px; padding: 6px 10px; border-radius: 99px; background: rgba(0, 0, 0, 0.72); color: #fff; font-size: 12px; font-weight: 700; opacity: calc(1 - var(--dim, 0) * 1.6); }
  .cap b { color: #ff8cc0; }

  /* ---------- totem ---------- */
  .totem { position: absolute; z-index: 5; left: 50%; top: 0; width: var(--tw); transform: translateX(-50%); pointer-events: none; }
  .bezel { padding: 12px; border-radius: 26px 26px 8px 8px; background: linear-gradient(160deg, #2a2328, #0c080b 55%, #1d161b); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 50px 90px -40px rgba(0, 0, 0, 0.9); }
  :global(.light) .bezel { background: linear-gradient(160deg, #ffffff, #efe9ec 60%, #faf6f8); box-shadow: inset 0 0 0 1px rgba(20, 16, 20, 0.1), 0 50px 90px -46px rgba(20, 16, 20, 0.5); }
  .screen { position: relative; aspect-ratio: 9 / 14; border-radius: 16px; overflow: hidden; background: #070407; color: #fff; }
  .chin { display: grid; place-items: center; height: 52px; margin-top: -2px; border-radius: 0 0 22px 22px; background: linear-gradient(180deg, #1d161b, #0c080b); }
  :global(.light) .chin { background: linear-gradient(180deg, #f3edf0, #e6dfe3); }
  .logo { position: relative; width: 34px; aspect-ratio: 32 / 25; filter: drop-shadow(0 0 10px rgba(255, 95, 168, 0.7)); }
  .logo i, .be i { position: absolute; left: 0; height: 20%; border-radius: 2px; background: var(--xs-brand); }
  .logo i:nth-child(1), .be i:nth-child(1) { top: 0; width: 100%; }
  .logo i:nth-child(2), .be i:nth-child(2) { top: 40%; width: 68.75%; }
  .logo i:nth-child(3), .be i:nth-child(3) { top: 80%; width: 100%; }
  .logo b, .be b { position: absolute; right: 0; top: 40%; width: 15.6%; aspect-ratio: 1; border-radius: 50%; background: #d6007d; }
  .foot { width: 28%; height: 40px; margin: -4px auto 0; background: linear-gradient(90deg, #120c10, #2a2328 50%, #120c10); clip-path: polygon(18% 0, 82% 0, 100% 100%, 0 100%); }
  :global(.light) .foot { background: linear-gradient(90deg, #ddd5da, #f6f1f4 50%, #ddd5da); }
  .floor { position: absolute; left: 50%; bottom: 8px; width: min(80%, 900px); height: 70px; transform: translateX(-50%); border-radius: 50%; background: radial-gradient(closest-side, rgba(214, 0, 125, 0.4), transparent); pointer-events: none; }
  :global(.light) .floor { background: radial-gradient(closest-side, rgba(214, 0, 125, 0.2), transparent); }

  /* screen sequence */
  .off { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0.35; }
  .seq { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .boot { position: absolute; inset: 0; z-index: 5; display: grid; place-items: center; background: #070407; animation: bootOut 0.3s ease 0.45s forwards; }
  .be { position: relative; width: 56px; aspect-ratio: 32 / 25; animation: bootE 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
  @keyframes bootE { from { transform: scale(0.4); opacity: 0; } }
  @keyframes bootOut { to { opacity: 0; visibility: hidden; } }
  .bar { display: flex; justify-content: space-between; padding: 10px 12px 8px; font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.6); }
  .media { position: relative; margin: 0 8px; aspect-ratio: 16 / 11; border-radius: 10px; overflow: hidden; background: #160d13; }
  .media img { width: 100%; height: 100%; object-fit: cover; clip-path: inset(0 0 100% 0); animation: scanIn 1.1s cubic-bezier(0.65, 0, 0.35, 1) 0.6s forwards; }
  .scan { position: absolute; left: 0; right: 0; top: 0; height: 3px; background: #ff5fa8; box-shadow: 0 0 18px 4px rgba(255, 95, 168, 0.7); opacity: 0; animation: scanLine 1.1s cubic-bezier(0.65, 0, 0.35, 1) 0.6s forwards; }
  @keyframes scanIn { to { clip-path: inset(0 0 0 0); } }
  @keyframes scanLine { 0% { opacity: 1; top: 0; } 95% { opacity: 1; top: 100%; } 100% { opacity: 0; top: 100%; } }
  .ui { position: relative; flex: 1; padding: 12px 12px 14px; display: flex; flex-direction: column; }
  .s-cat { font-size: 9px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #ff8cc0; opacity: 0; animation: fadeUp 0.5s ease 0.8s forwards; }
  .s-title { margin-top: 4px; font-size: clamp(18px, 1.7vw, 24px); font-weight: 800; line-height: 1; letter-spacing: -0.03em; opacity: 0; animation: fadeUp 0.6s ease 0.9s forwards; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .gen { margin-top: auto; opacity: 0; animation: fadeUp 0.4s ease 1.05s forwards, genOut 0.3s ease 2.8s forwards; }
  @keyframes genOut { to { opacity: 0; transform: translateY(-6px); } }
  .gen-l { font-size: 11px; font-weight: 700; color: rgba(255, 255, 255, 0.7); }
  .gen-bar { display: block; margin-top: 6px; height: 5px; border-radius: 3px; background: rgba(255, 255, 255, 0.12); overflow: hidden; }
  .gen-bar i { display: block; height: 100%; background: var(--xs-brand); transform: scaleX(0); transform-origin: left; animation: gen 1.6s cubic-bezier(0.4, 0, 0.2, 1) 1.15s forwards; }
  @keyframes gen { to { transform: scaleX(1); } }
  .done { position: absolute; left: 12px; right: 12px; bottom: 14px; display: flex; align-items: center; gap: 10px; opacity: 0; transform: scale(0.9); animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 2.9s forwards; }
  @keyframes pop { to { opacity: 1; transform: none; } }
  .qr { display: grid; grid-template-columns: repeat(9, 1fr); gap: 1px; width: 50px; padding: 4px; border-radius: 6px; background: #fff; flex: none; }
  .qr i { aspect-ratio: 1; }
  .qr i.on { background: #141014; }
  .done-t { font-size: 12px; line-height: 1.3; color: rgba(255, 255, 255, 0.8); }
  .done-t b { display: block; font-size: 16px; color: #fff; }

  /* "selecting" overlay while the ring spins */
  .selecting { position: absolute; inset: 0; z-index: 6; display: grid; place-content: center; justify-items: center; gap: 8px; background: rgba(7, 4, 7, 0.92); opacity: 0; transition: opacity 0.25s ease; }
  .selecting.on { opacity: 1; }
  .noise { position: absolute; inset: 0; opacity: 0.12; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); animation: noise 0.4s steps(3) infinite; }
  @keyframes noise { 50% { transform: translate(-6px, 4px); } }
  .sel-t { position: relative; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #ff8cc0; }
  .sel-n { position: relative; font-size: 18px; font-weight: 800; text-align: center; padding: 0 10px; }

  /* ---------- controls + info ---------- */
  .controls { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: clamp(16px, 3vh, 32px); }
  .arrow { display: grid; place-items: center; width: 52px; height: 52px; border: 0; border-radius: 50%; background: var(--xs-card); color: var(--xs-ink); cursor: pointer; box-shadow: inset 0 0 0 1.5px var(--xs-line); transition: background 0.3s, color 0.3s, transform 0.3s var(--xs-ease), box-shadow 0.3s; }
  .arrow:hover { background: #d6007d; color: #fff; box-shadow: none; transform: scale(1.08); }
  .arrow svg { width: 20px; height: 20px; }
  .pips { display: flex; gap: 8px; }
  .pip { width: 10px; height: 10px; padding: 0; border: 0; border-radius: 99px; background: var(--xs-faint); cursor: pointer; transition: width 0.4s var(--xs-ease), background 0.3s; }
  .pip.on { width: 34px; background: var(--xs-brand); }

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

  /* desktop: orbit on the left, description on the right */
  @media (min-width: 901px) {
    .layout { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); align-items: center; max-width: 1400px; margin: 0 auto; padding: 0 clamp(16px, 3vw, 40px); }
    .left { min-width: 0; }
    .stage { --tw: clamp(200px, 16.5vw, 260px); }
    .card { --w: clamp(160px, 14.5vw, 230px); }
    .info { margin-top: 0; padding: 0; position: relative; z-index: 6; }
    .info-in { max-width: 460px; margin: 0; }
    .cols { grid-template-columns: 1fr; gap: 18px; }
    .top { margin-bottom: 0; }
  }

  @media (max-width: 900px) {
    .stage { --tw: 56vw; }
    .card { --w: 40vw; }
    .media { aspect-ratio: 16 / 10; }
    .s-cat { display: none; }
    .s-title { font-size: 16px; }
    .done { gap: 8px; bottom: 10px; left: 10px; right: 10px; }
    .qr { width: 40px; padding: 3px; }
    .done-t { font-size: 10px; }
    .done-t b { font-size: 13px; }
    .bar { font-size: 8px; padding: 8px 10px 6px; }
    .cols { grid-template-columns: 1fr; }
    .arrow { width: 44px; height: 44px; }
    .pips { gap: 6px; }
  }
</style>
