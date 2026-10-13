<script lang="ts">
  import PageHero from '$lib/components/story/PageHero.svelte';
  import ManifestE from '$lib/components/story/ManifestE.svelte';
  import HistoryRoad from '$lib/components/story/HistoryRoad.svelte';
  import NumbersGrid from '$lib/components/story/NumbersGrid.svelte';
  import ClientsWall from '$lib/components/story/ClientsWall.svelte';
  import CtaClose from '$lib/components/story/CtaClose.svelte';
  import { reveal, viewProgress } from '$lib/components/story/reveal';
  import '$lib/components/story/story.css';

  const values = ['Rigor analítico', 'Creatividad disruptiva', 'Respeto por las personas'];
</script>

<PageHero
  title={'CambIA el mundo.\nCambIA tu evento.'}
  accent="evento."
  lead="La primera consultora de inteligencia artificial especializada al 100% en el sector MICE. Nacimos en 2024 para transformar la industria de los eventos desde el conocimiento profundo del sector."
/>

<ManifestE />

<HistoryRoad />

<!-- Founder quote -->
<section class="xs xs-section quote">
  <div class="xs-wrap">
    <blockquote data-rv use:reveal>
      <span class="xs-bar qbar" aria-hidden="true"></span>
      <p>«La IA nos permite hacer los eventos más humanos, no menos. Cada activación está diseñada para crear conexión real entre la marca y las personas.»</p>
      <footer>Guillermo Prado Vázquez, Fundador de Externia</footer>
    </blockquote>
  </div>
</section>

<NumbersGrid />

<ClientsWall />

<!-- People behind it -->
<section class="xs xs-section people" use:viewProgress>
  <div class="xs-wrap">
    <div class="head" data-rv use:reveal>
      <h2 class="xs-h2">Personas que hacen posible la <em>magia.</em></h2>
      <p class="xs-lead">Nuestro mayor orgullo son las conexiones que hemos hecho en este tiempo. Todas con un denominador común: la convicción de que la IA, bien aplicada, puede hacer los eventos más humanos.</p>
    </div>

    <div class="grid">
      <figure class="team" data-rv="mask" use:reveal>
        <img src="/team/equipo-mpi.webp" alt="Equipo Externia en MPI Iberian Chapter" loading="lazy" decoding="async" />
        <figcaption><b>MPI Iberian Chapter · Valencia 2025</b> Equipo Externia en el Global Meetings Industry Day</figcaption>
      </figure>

      <article class="founder" data-rv use:reveal style="--d: 120ms">
        <div class="fphoto"><img src="/team/guillermo-ganador.webp" alt="Guillermo Prado — Ganador Event Industry Entrepreneur 2025" loading="lazy" decoding="async" /></div>
        <span class="role">Fundador &amp; CEO</span>
        <h3>Guillermo Prado Vázquez</h3>
        <p>Doctor en Biociencias Moleculares (UAM) · Exinvestigador Hospital La Paz · Especialista en IA aplicada a eventos MICE</p>
        <ul class="badges">
          <li>Event Industry Entrepreneur — Ganador</li>
          <li>Innovation Champion — Finalista</li>
        </ul>
      </article>
    </div>

    <ul class="values">
      {#each values as v, i}
        <li data-rv use:reveal style="--d: {i * 90}ms"><span class="xs-bar" style="width: {i === 1 ? 68.75 : 100}%"></span>{v}</li>
      {/each}
    </ul>
  </div>
</section>

<CtaClose
  title="Transforma tu próximo evento con Inteligencia Artificial."
  accent="Inteligencia Artificial."
  text="Descubre cómo Externia puede crear una experiencia MAPI para tu próximo evento."
  href="/servicios"
  label="Ver activaciones"
/>

<style>
  .quote blockquote { margin: 0 auto; max-width: 980px; }
  .qbar { width: 80px; margin-bottom: 28px; }
  .quote p { margin: 0; font-size: clamp(26px, 3.4vw, 52px); font-weight: 800; line-height: 1.15; letter-spacing: -0.025em; }
  .quote footer { margin-top: 24px; font-size: 15px; font-weight: 700; color: var(--xs-pink-2); }

  .people { overflow: hidden; background-color: var(--xs-bg-2); }
  .head { display: grid; grid-template-columns: 1fr 1fr; gap: 24px 64px; align-items: end; margin-bottom: clamp(40px, 7vh, 72px); }
  .head .xs-h2 { font-size: clamp(36px, 5vw, 80px); }
  .grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: clamp(20px, 3vw, 40px); align-items: start; }
  .team { position: relative; margin: 0; border-radius: 28px; overflow: hidden; aspect-ratio: 4 / 3; }
  .team img { width: 100%; height: 118%; object-fit: cover; object-position: center 30%; transform: translateY(calc((var(--vp, 0.5) - 0.5) * -12%)); }
  .team figcaption { position: absolute; left: 16px; right: 16px; bottom: 16px; padding: 14px 18px; border-radius: 16px; background: rgba(0, 0, 0, 0.72); color: #fff; font-size: 14px; line-height: 1.45; }
  .team figcaption b { display: block; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #ff8cc0; }
  .founder { padding: clamp(20px, 2.4vw, 32px); border-radius: 28px; background: var(--xs-card); box-shadow: inset 0 0 0 1px var(--xs-line); }
  .fphoto { aspect-ratio: 4 / 3; border-radius: 18px; overflow: hidden; margin-bottom: 20px; }
  .fphoto img { width: 100%; height: 100%; object-fit: cover; object-position: center 15%; transition: transform 1s var(--xs-ease); }
  .founder:hover .fphoto img { transform: scale(1.05); }
  .role { font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--xs-pink-2); }
  .founder h3 { margin: 8px 0 0; font-size: clamp(22px, 2vw, 30px); font-weight: 800; letter-spacing: -0.02em; }
  .founder p { margin: 10px 0 0; font-size: 15px; line-height: 1.55; color: var(--xs-muted); }
  .badges { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 8px; }
  .badges li { padding: 8px 14px; border-radius: 99px; font-size: 13px; font-weight: 700; box-shadow: inset 0 0 0 1px var(--xs-pink); color: var(--xs-pink-2); width: fit-content; }
  .values { list-style: none; margin: clamp(48px, 8vh, 88px) 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(16px, 3vw, 40px); }
  .values li { display: grid; gap: 16px; font-size: clamp(22px, 2.2vw, 34px); font-weight: 800; letter-spacing: -0.02em; }
  .values .xs-bar { height: 8px; transform-origin: left; transform: scaleX(0); transition: transform 1.1s var(--xs-ease) 0.2s; }
  .values li:global(.in) .xs-bar { transform: scaleX(1); }

  @media (max-width: 900px) {
    .head, .grid { grid-template-columns: 1fr; }
    .values { grid-template-columns: 1fr; }
  }
</style>
