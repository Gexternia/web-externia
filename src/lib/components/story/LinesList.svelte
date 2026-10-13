<script lang="ts">
  import './story.css';
  import { reveal } from './reveal';

  const lines = [
    { href: '/consultoria', title: 'Consultoría', desc: 'Integramos la IA en tu agencia o empresa con una hoja de ruta clara.', img: '/team/guillermo-premio-sm.webp', pos: 'center 18%' },
    { href: '/servicios', title: 'Activaciones', desc: 'Experiencias de IA hiperpersonalizadas, diseñadas para tu evento.', img: '/activaciones/fxstylized.webp', pos: 'center' },
    { href: '/formacion', title: 'Formación', desc: 'Programas para que tu equipo domine la IA aplicada a eventos.', img: '/team/guillermo-ganador-sm.webp', pos: 'center 20%' },
    { href: '/quienes-somos', title: 'Quiénes somos', desc: 'De la ciencia oncológica a revolucionar los eventos: nuestra historia.', img: '/team/equipo-mpi-sm.webp', pos: 'center 35%' }
  ];
</script>

<section class="xs next" aria-label="Qué hacemos">
  <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i></div>
  <div class="xs-wrap">
    <h2 class="head" data-rv use:reveal>Elige por dónde empezar.</h2>
    <ul class="lines">
      {#each lines as l, i}
        <li data-rv use:reveal style="--d: {i * 90}ms">
          <a href={l.href}>
            <span class="l-bar" aria-hidden="true"></span>
            <span class="l-title">{l.title}</span>
            <span class="l-desc">{l.desc}</span>
            <span class="l-img" aria-hidden="true"><img src={l.img} alt="" loading="lazy" decoding="async" style="object-position: {l.pos}" /></span>
            <span class="l-go" aria-hidden="true">→</span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .next { overflow: hidden; padding: clamp(96px, 14vh, 160px) 0; }
  .next :global(.xs-ambient i) { transform: none; }
  .head { margin: 0 0 clamp(32px, 6vh, 56px); font-size: clamp(36px, 5vw, 72px); font-weight: 800; letter-spacing: -0.03em; }
  .lines { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--xs-line); }
  .lines a { display: grid; grid-template-columns: 56px 1fr 1fr clamp(140px, 14vw, 200px) 40px; align-items: center; gap: 24px; padding: clamp(24px, 4vh, 40px) 0; border-bottom: 1px solid var(--xs-line); color: inherit; text-decoration: none; }
  .l-bar { height: 10px; border-radius: 2px; background: var(--xs-brand); transform: scaleX(0.4); transform-origin: left; transition: transform 0.6s var(--xs-ease); }
  .lines a:hover .l-bar, .lines a:focus-visible .l-bar { transform: scaleX(1); }
  .l-title { font-size: clamp(30px, 4vw, 60px); font-weight: 800; letter-spacing: -0.03em; transition: transform 0.6s var(--xs-ease), color 0.3s; }
  .lines a:hover .l-title { transform: translateX(8px); color: var(--xs-pink-2); }
  .l-desc { color: var(--xs-muted); font-size: 16px; line-height: 1.5; }
  .l-img { position: relative; display: block; aspect-ratio: 16 / 10; border-radius: 14px; overflow: hidden; clip-path: inset(0 0 100% 0 round 14px); transition: clip-path 1.1s var(--xs-ease) 0.15s, transform 0.6s var(--xs-ease); }
  li:global(.in) .l-img { clip-path: inset(0 0 0 0 round 14px); }
  .l-img img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.15); transition: transform 1.2s var(--xs-ease); }
  li:global(.in) .l-img img { transform: scale(1); }
  .lines a:hover .l-img { transform: rotate(-2deg) scale(1.08); }
  .lines a:hover .l-img img { transform: scale(1.06); }
  .l-go { font-size: 26px; opacity: 0; transform: translateX(-10px); transition: opacity 0.3s, transform 0.5s var(--xs-ease); }
  .lines a:hover .l-go { opacity: 1; transform: none; }

  @media (max-width: 900px) {
    .lines a { grid-template-columns: 36px 1fr 96px; row-gap: 6px; }
    .l-desc { grid-column: 2; }
    .l-img { grid-column: 3; grid-row: 1 / span 2; border-radius: 10px; }
    .l-go { display: none; }
  }
</style>
