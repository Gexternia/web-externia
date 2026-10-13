<script lang="ts">
  import '$lib/components/story/story.css';

  const legal = [
    { label: 'Aviso legal', href: '/aviso-legal' },
    { label: 'Privacidad', href: '/politica-privacidad' },
    { label: 'Cookies', href: '/politica-cookies' }
  ];
</script>

<footer class="xs foot">
  <div class="xs-wrap row">
    <a href="/" class="brand" aria-label="Externia — Inicio">
      <span class="E" aria-hidden="true"><i></i><i></i><i></i><b></b></span>
      <span class="word">xternia</span>
    </a>

    <nav class="links" aria-label="Contacto y legal">
      <a href="mailto:g.prado@externia.ai">g.prado@externia.ai</a>
      <a href="tel:+34648264949">+34 648 264 949</a>
      <span class="sep" aria-hidden="true"></span>
      {#each legal as l}<a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>{/each}
    </nav>

    <div class="soc">
      <a href="https://www.instagram.com/externia.ai/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
      </a>
      <a href="https://www.youtube.com/watch?v=fyhhzgNvunw&t=1s" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
      </a>
    </div>
  </div>
  <div class="xs-wrap bottom">
    <p>2026 © <span>Externia</span> · Consultoría de IA para eventos</p>
  </div>
</footer>

<style>
  .foot { background-color: var(--xs-bg-2); border-top: 1px solid var(--xs-line); padding: 32px 0 20px; font-size: 14px; }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 20px 32px; flex-wrap: wrap; }

  .brand { display: inline-flex; align-items: center; gap: 4px; color: var(--xs-ink); text-decoration: none; }
  .E { position: relative; width: 28px; aspect-ratio: 32 / 25; }
  .E i { position: absolute; left: 0; height: 20%; border-radius: 1px; background: var(--xs-brand); }
  .E i:nth-child(1) { top: 0; width: 100%; }
  .E i:nth-child(2) { top: 40%; width: 68.75%; }
  .E i:nth-child(3) { top: 80%; width: 100%; }
  .E b { position: absolute; right: 0; top: 40%; width: 15.6%; aspect-ratio: 1; border-radius: 50%; background: #d6007d; }
  .word { font-size: 24px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; }

  .links { display: flex; align-items: center; gap: 6px 20px; flex-wrap: wrap; }
  .links a { color: var(--xs-muted); text-decoration: none; transition: color 0.25s; }
  .links a:hover { color: var(--xs-pink-2); }
  .sep { width: 1px; height: 14px; background: var(--xs-line); }

  .soc { display: flex; gap: 6px; }
  .soc a { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; color: var(--xs-muted); box-shadow: inset 0 0 0 1px var(--xs-line); transition: color 0.25s, box-shadow 0.25s; }
  .soc a:hover { color: var(--xs-pink-2); box-shadow: inset 0 0 0 1px var(--xs-pink); }
  .soc svg { width: 16px; height: 16px; }

  .bottom { margin-top: 20px; }
  .bottom p { margin: 0; padding-top: 16px; border-top: 1px solid var(--xs-line); font-size: 13px; color: var(--xs-muted); }
  .bottom span { color: var(--xs-pink-2); font-weight: 700; }

  @media (max-width: 700px) {
    .row { flex-direction: column; align-items: flex-start; }
    .sep { display: none; }
  }
</style>
