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

  // a deterministic QR-like pattern for the "done" screen
  const qr = Array.from({ length: 81 }, (_, i) => {
    const x = i % 9, y = Math.floor(i / 9);
    const finder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5);
    if (finder) return !(x % 2 === 1 && y % 2 === 1 && (x === 1 || x === 7) && (y === 1 || y === 7));
    return Math.sin(i * 12.9898) * 43758.5453 % 1 > 0.1;
  });

  let el: HTMLElement;
  let totem: HTMLElement;
  let idx = $state(0);
  let run = $state(0);   // restarts the screen sequence
  let started = $state(false);

  const pick = (i: number) => { idx = i; run++; started = true; };
  const a = $derived(activations[idx]);

  onMount(() => {
    activations.forEach((x) => { const im = new Image(); im.decoding = 'async'; im.src = x.image; });
    // power the totem on the first time it comes into view
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { started = true; io.disconnect(); } }, { threshold: 0.4 });
    io.observe(totem);
    // the totem leans gently toward the pointer
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      totem.style.transform = `perspective(1200px) rotateY(${cx.toFixed(2)}deg) rotateX(${cy.toFixed(2)}deg)`;
      raf = Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 10;
      ty = ((e.clientY - r.top) / r.height - 0.5) * -6;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const leave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { io.disconnect(); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
  });

  const key = (e: KeyboardEvent, i: number) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); const n = (i + 1) % activations.length; pick(n); (el.querySelectorAll<HTMLButtonElement>('.opt')[n]).focus(); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); const n = (i - 1 + activations.length) % activations.length; pick(n); (el.querySelectorAll<HTMLButtonElement>('.opt')[n]).focus(); }
  };
</script>

<section class="xs tot" bind:this={el} aria-label="Activaciones">
  <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i><span class="grid"></span></div>
  <div class="xs-wrap">
    <div class="grid">
      <!-- the totem -->
      <div class="stand" aria-hidden="true">
        <div class="totem" bind:this={totem}>
          <div class="bezel">
            <div class="screen">
              {#if !started}
                <div class="off"><span class="be"><i></i><i></i><i></i><b></b></span></div>
              {:else}
              {#key run}
                <div class="seq">
                  <div class="boot"><span class="be"><i></i><i></i><i></i><b></b></span></div>
                  <div class="bar">
                    <span>Externia</span>
                    <span>Activación {String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <div class="media">
                    <img src={a.image} alt="" style="object-position: {a.pos}" />
                    <span class="scan"></span>
                  </div>
                  <div class="ui">
                    <span class="s-cat">{a.category}</span>
                    <span class="s-title">{a.title}</span>
                    <div class="gen">
                      <span class="gen-l">Generando con IA…</span>
                      <span class="gen-bar"><i></i></span>
                    </div>
                    <div class="done">
                      <span class="qr">{#each qr as on}<i class:on></i>{/each}</span>
                      <span class="done-t"><b>¡Listo!</b> Escanea y llévatelo</span>
                    </div>
                  </div>
                </div>
              {/key}
              {/if}
            </div>
          </div>
          <div class="chin"><span class="logo"><i></i><i></i><i></i><b></b></span></div>
        </div>
        <div class="foot"></div>
        <div class="floor"></div>
      </div>

      <!-- the control panel -->
      <div class="panel">
        <div class="top" data-rv use:reveal>
          <h2 class="xs-h2">Elige una activación <em>y pruébala.</em></h2>
          <p class="xs-lead">8 experiencias de IA en 3 líneas temáticas. Pulsa cualquiera y el tótem la pone en marcha.</p>
        </div>
        <ul class="opts" role="listbox" aria-label="Activaciones">
          {#each activations as x, i}
            <li>
              <button class="opt" class:on={i === idx} role="option" aria-selected={i === idx} tabindex={i === idx ? 0 : -1} onclick={() => pick(i)} onkeydown={(e) => key(e, i)}>
                <span class="led" aria-hidden="true"></span>
                <span class="n">{String(i + 1).padStart(2, '0')}</span>
                <span class="nm">{x.title}</span>
                <span class="ct">{x.category}</span>
              </button>
            </li>
          {/each}
        </ul>

        <div class="detail" aria-live="polite">
          {#key idx}
            <div class="d-in">
              <p>{a.desc}</p>
              <p class="ideal"><b>Ideal para</b> {a.ideal}</p>
              {#if a.link}
                <a class="xs-btn cta" href={a.link} target="_blank" rel="noopener">Probar la demo <span aria-hidden="true">→</span></a>
              {:else}
                <a class="xs-btn xs-btn--ghost cta" href="/contacto">Quiero esta activación <span aria-hidden="true">→</span></a>
              {/if}
            </div>
          {/key}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .tot { padding: clamp(88px, 13vh, 150px) 0; overflow: hidden; }
  .top { margin-bottom: clamp(20px, 3.5vh, 36px); }
  .top .xs-h2 { font-size: clamp(34px, 3.8vw, 60px); }
  .top .xs-lead { margin-top: 12px; font-size: clamp(15px, 1.15vw, 18px); }
  .grid { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: clamp(32px, 6vw, 96px); align-items: center; }

  /* ---------- totem ---------- */
  .stand { position: relative; display: grid; justify-items: center; }
  .totem { position: relative; width: min(100%, 330px, calc((100svh - 230px) * 0.55)); transform-style: preserve-3d; will-change: transform; }
  .bezel { padding: 14px; border-radius: 30px 30px 10px 10px; background: linear-gradient(160deg, #2a2328, #0c080b 55%, #1d161b); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 50px 90px -40px rgba(0, 0, 0, 0.85); }
  :global(.light) .bezel { background: linear-gradient(160deg, #ffffff, #efe9ec 60%, #faf6f8); box-shadow: inset 0 0 0 1px rgba(20, 16, 20, 0.1), 0 50px 90px -46px rgba(20, 16, 20, 0.45); }
  .screen { position: relative; aspect-ratio: 9 / 14; border-radius: 18px; overflow: hidden; background: #070407; color: #fff; }
  .chin { display: grid; place-items: center; height: 58px; margin-top: -2px; border-radius: 0 0 26px 26px; background: linear-gradient(180deg, #1d161b, #0c080b); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06); }
  :global(.light) .chin { background: linear-gradient(180deg, #f3edf0, #e6dfe3); }
  .logo { position: relative; width: 38px; aspect-ratio: 32 / 25; filter: drop-shadow(0 0 10px rgba(255, 95, 168, 0.7)); }
  .logo i, .be i { position: absolute; left: 0; height: 20%; border-radius: 2px; background: var(--xs-brand); }
  .logo i:nth-child(1), .be i:nth-child(1) { top: 0; width: 100%; }
  .logo i:nth-child(2), .be i:nth-child(2) { top: 40%; width: 68.75%; }
  .logo i:nth-child(3), .be i:nth-child(3) { top: 80%; width: 100%; }
  .logo b, .be b { position: absolute; right: 0; top: 40%; width: 15.6%; aspect-ratio: 1; border-radius: 50%; background: #d6007d; }
  .foot { width: 26%; height: 44px; margin-top: -4px; background: linear-gradient(90deg, #120c10, #2a2328 50%, #120c10); clip-path: polygon(18% 0, 82% 0, 100% 100%, 0 100%); }
  :global(.light) .foot { background: linear-gradient(90deg, #ddd5da, #f6f1f4 50%, #ddd5da); }
  .floor { width: 70%; height: 22px; margin-top: -8px; border-radius: 50%; background: radial-gradient(closest-side, rgba(214, 0, 125, 0.45), transparent); }

  /* ---------- the screen sequence ---------- */
  .seq { position: absolute; inset: 0; display: flex; flex-direction: column; }
  .off { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0.35; }
  .boot { position: absolute; inset: 0; z-index: 5; display: grid; place-items: center; background: #070407; animation: bootOut 0.35s ease 0.55s forwards; }
  .be { position: relative; width: 64px; aspect-ratio: 32 / 25; animation: bootE 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
  @keyframes bootE { from { transform: scale(0.4); opacity: 0; } }
  @keyframes bootOut { to { opacity: 0; visibility: hidden; } }

  .bar { display: flex; justify-content: space-between; padding: 12px 14px 10px; font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 255, 255, 0.6); }
  .media { position: relative; margin: 0 10px; aspect-ratio: 16 / 11; border-radius: 12px; overflow: hidden; background: #160d13; }
  .media img { width: 100%; height: 100%; object-fit: cover; clip-path: inset(0 0 100% 0); animation: scanIn 1.3s cubic-bezier(0.65, 0, 0.35, 1) 0.75s forwards; }
  .scan { position: absolute; left: 0; right: 0; top: 0; height: 3px; background: #ff5fa8; box-shadow: 0 0 18px 4px rgba(255, 95, 168, 0.7); opacity: 0; animation: scanLine 1.3s cubic-bezier(0.65, 0, 0.35, 1) 0.75s forwards; }
  @keyframes scanIn { to { clip-path: inset(0 0 0 0); } }
  @keyframes scanLine { 0% { opacity: 1; top: 0; } 95% { opacity: 1; top: 100%; } 100% { opacity: 0; top: 100%; } }

  .ui { position: relative; flex: 1; padding: 14px 14px 16px; display: flex; flex-direction: column; }
  .s-cat { font-size: 10px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: #ff8cc0; opacity: 0; animation: fadeUp 0.5s ease 0.9s forwards; }
  .s-title { margin-top: 4px; font-size: clamp(22px, 2.2vw, 30px); font-weight: 800; line-height: 1; letter-spacing: -0.03em; opacity: 0; animation: fadeUp 0.6s ease 1s forwards; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  .gen { margin-top: auto; opacity: 0; animation: fadeUp 0.4s ease 1.2s forwards, genOut 0.3s ease 3.1s forwards; }
  @keyframes genOut { to { opacity: 0; transform: translateY(-6px); } }
  .gen-l { font-size: 12px; font-weight: 700; color: rgba(255, 255, 255, 0.7); }
  .gen-bar { display: block; margin-top: 8px; height: 6px; border-radius: 3px; background: rgba(255, 255, 255, 0.12); overflow: hidden; }
  .gen-bar i { display: block; height: 100%; background: var(--xs-brand); transform: scaleX(0); transform-origin: left; animation: gen 1.7s cubic-bezier(0.4, 0, 0.2, 1) 1.3s forwards; }
  @keyframes gen { to { transform: scaleX(1); } }
  .done { position: absolute; left: 14px; right: 14px; bottom: 16px; display: flex; align-items: center; gap: 12px; opacity: 0; transform: scale(0.9); animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 3.2s forwards; }
  @keyframes pop { to { opacity: 1; transform: none; } }
  .qr { display: grid; grid-template-columns: repeat(9, 1fr); gap: 1px; width: 58px; padding: 5px; border-radius: 8px; background: #fff; flex: none; }
  .qr i { aspect-ratio: 1; }
  .qr i.on { background: #141014; }
  .done-t { font-size: 13px; line-height: 1.3; color: rgba(255, 255, 255, 0.8); }
  .done-t b { display: block; font-size: 18px; color: #fff; }

  /* ---------- control panel ---------- */
  .opts { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .opt { position: relative; display: grid; grid-template-columns: auto auto 1fr; grid-template-rows: auto auto; align-items: center; gap: 2px 10px; width: 100%; padding: 14px 16px; border: 0; border-radius: 16px; background: var(--xs-card); color: var(--xs-ink); font: inherit; text-align: left; cursor: pointer; box-shadow: inset 0 0 0 1px var(--xs-line); transition: box-shadow 0.3s, transform 0.3s var(--xs-ease), background 0.3s; }
  .opt:hover { transform: translateY(-2px); box-shadow: inset 0 0 0 1.5px var(--xs-pink); }
  .opt.on { background: #d6007d; color: #fff; box-shadow: 0 16px 34px -16px rgba(214, 0, 125, 0.8); }
  .opt:focus-visible { outline: 2px solid var(--xs-pink); outline-offset: 3px; }
  .led { grid-row: 1 / span 2; width: 10px; height: 10px; border-radius: 50%; background: var(--xs-faint); box-shadow: inset 0 0 0 1px var(--xs-line); }
  .opt.on .led { background: #ffe066; box-shadow: 0 0 10px 2px rgba(255, 224, 102, 0.8); }
  .n { grid-row: 1 / span 2; font-size: 13px; font-weight: 800; color: var(--xs-pink-2); }
  .opt.on .n { color: rgba(255, 255, 255, 0.8); }
  .nm { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; }
  .ct { grid-column: 3; font-size: 12px; color: var(--xs-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .opt.on .ct { color: rgba(255, 255, 255, 0.78); }

  .detail { position: relative; margin-top: 22px; min-height: 190px; }
  .d-in { animation: dIn 0.6s var(--xs-ease) both; }
  @keyframes dIn { from { opacity: 0; transform: translateY(14px); } }
  .detail p { margin: 0; font-size: clamp(16px, 1.25vw, 19px); line-height: 1.6; color: var(--xs-muted); max-width: 54ch; }
  .detail .ideal { margin-top: 14px; font-size: 14px; }
  .detail .ideal b { display: block; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--xs-ink); }
  .cta { margin-top: 22px; padding: 14px 24px; font-size: 15px; }

  @media (max-width: 900px) {
    .grid { grid-template-columns: 1fr; }
    .panel { display: contents; }
    .top { order: -1; }
    .stand { order: 0; }
    .opts { order: 1; }
    .detail { order: 2; }
    .totem { width: min(78vw, 300px); }
    .foot { height: 40px; }
    .opts { grid-template-columns: 1fr 1fr; }
    .opt { padding: 12px; grid-template-columns: auto 1fr; }
    .led { display: none; }
    .nm { font-size: 15px; }
    .ct { display: none; }
  }
</style>
