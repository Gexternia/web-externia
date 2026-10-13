<script lang="ts">
  import { onMount } from 'svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import '$lib/components/story/story.css';

  let ready = $state(false);
  onMount(() => requestAnimationFrame(() => (ready = true)));

  const title = ['Hablemos', 'de', 'tu', 'próximo', 'evento.'];
</script>

<section class="xs contact" class:ready>
  <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i><span class="grid"></span></div>
  <div class="xs-wrap grid2">
    <div class="left">
      <h1 class="t">
        {#each title as w, i}<span class="w"><span class:hot={i >= 3} style="--i: {i}">{w}</span></span>{' '}{/each}
      </h1>
      <p class="lead">Cuéntanos qué tienes en mente y te proponemos la solución MAPI perfecta para tu evento. Te respondemos sin compromiso.</p>

      <dl class="direct">
        <div>
          <dt>Email</dt>
          <dd><a href="mailto:g.prado@externia.ai">g.prado@externia.ai</a></dd>
        </div>
        <div>
          <dt>Teléfono</dt>
          <dd><a href="tel:+34648264949">+34 648 264 949</a></dd>
        </div>
        <div>
          <dt>Síguenos</dt>
          <dd class="soc">
            <a href="https://www.instagram.com/externia.ai/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.youtube.com/watch?v=fyhhzgNvunw&t=1s" target="_blank" rel="noopener noreferrer">YouTube</a>
          </dd>
        </div>
      </dl>
    </div>

    <div class="right">
      <ContactForm />
    </div>
  </div>
</section>

<style>
  .contact { min-height: 100vh; min-height: 100svh; padding: calc(96px + 6vh) 0 clamp(80px, 12vh, 140px); overflow: hidden; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(40px, 7vw, 120px); align-items: start; }

  .t { margin: 0; font-size: clamp(48px, 6.6vw, 108px); font-weight: 800; line-height: 0.95; letter-spacing: -0.045em; }
  .w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.08em; margin-bottom: -0.08em; }
  .w > span { display: inline-block; transform: translateY(105%); transition: transform 1.1s var(--xs-ease); transition-delay: calc(var(--i) * 70ms + 100ms); }
  .ready .w > span { transform: none; }
  .hot { color: var(--xs-pink-2); }

  .lead, .direct, .right { transform: translateY(20px); transition: transform 1s var(--xs-ease); }
  .ready .lead, .ready .direct, .ready .right { transform: none; }
  .lead { margin: 28px 0 0; max-width: 44ch; font-size: clamp(17px, 1.4vw, 21px); line-height: 1.6; color: var(--xs-muted); transition-delay: 0.15s; }
  .direct { margin: clamp(40px, 7vh, 72px) 0 0; display: grid; gap: 0; border-top: 1px solid var(--xs-line); transition-delay: 0.2s; }
  .direct div { display: grid; grid-template-columns: 120px 1fr; align-items: baseline; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--xs-line); }
  .direct dt { font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--xs-muted); }
  .direct dd { margin: 0; font-size: clamp(18px, 1.5vw, 22px); font-weight: 700; }
  .direct a { color: var(--xs-ink); text-decoration: none; background: linear-gradient(var(--xs-pink), var(--xs-pink)) 0 100% / 0 2px no-repeat; transition: background-size 0.5s var(--xs-ease), color 0.3s; }
  .direct a:hover { background-size: 100% 2px; color: var(--xs-pink-2); }
  .soc { display: flex; gap: 20px; flex-wrap: wrap; }
  .right { padding-top: 8px; transition-delay: 0.1s; }

  @media (max-width: 900px) {
    .grid2 { grid-template-columns: 1fr; gap: 56px; }
    .direct div { grid-template-columns: 96px 1fr; }
  }
</style>
