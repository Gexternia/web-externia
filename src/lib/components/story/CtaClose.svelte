<script lang="ts">
  import './story.css';
  import { reveal, viewProgress } from './reveal';

  interface Props {
    title: string;
    accent?: string;
    text?: string;
    href?: string;
    label?: string;
    showContact?: boolean;
  }
  let { title, accent = '', text = '', href = '/contacto', label = 'Contactar ahora', showContact = true }: Props = $props();
  const hot = $derived(new Set(accent.split(/\s+/).filter(Boolean)));
  const words = $derived(title.split(/\s+/).filter(Boolean));
</script>

<section class="xs close" use:viewProgress>
  <div class="xs-ambient" aria-hidden="true"><i class="a1"></i><i class="a2"></i></div>
  <!-- three bars sweep in from the sides as the section arrives -->
  <div class="rails" aria-hidden="true">
    <span class="r r1"></span><span class="r r2"></span><span class="r r3"></span>
  </div>
  <div class="xs-wrap inner" use:reveal>
    <h2 class="t">
      {#each words as w, i}<span class="w"><span class:hot={hot.has(w)} style="--i: {i}">{w}</span></span>{' '}{/each}
    </h2>
    {#if text}<p class="txt">{text}</p>{/if}
    <a class="xs-btn" {href}>{label} <span aria-hidden="true">→</span></a>
    {#if showContact}
      <p class="contact">
        <a href="mailto:g.prado@externia.ai">g.prado@externia.ai</a>
        <span aria-hidden="true">·</span>
        <a href="tel:+34648264949">+34 648 264 949</a>
      </p>
    {/if}
  </div>
</section>

<style>
  .close { position: relative; overflow: hidden; padding: clamp(120px, 20vh, 220px) 0 clamp(100px, 16vh, 180px); text-align: center; }
  .rails { position: absolute; inset: 0; z-index: -1; display: grid; align-content: center; gap: clamp(18px, 4vh, 40px); pointer-events: none; opacity: 0.16; }
  :global(.light) .rails { opacity: 0.12; }
  .r { display: block; height: clamp(40px, 9vh, 90px); background: var(--xs-brand); border-radius: 8px; will-change: transform; }
  .r1 { transform: translateX(calc((1 - var(--vp, 0) * 1.6) * -100%)); }
  .r2 { width: 68.75%; transform: translateX(calc((1 - var(--vp, 0) * 1.6) * 100% + 45%)); }
  .r3 { transform: translateX(calc((1 - var(--vp, 0) * 1.6) * -100%)); }

  .t { margin: 0 auto; max-width: 15ch; font-size: clamp(48px, 8vw, 128px); font-weight: 800; line-height: 0.95; letter-spacing: -0.045em; }
  .w { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.08em; margin-bottom: -0.08em; }
  .w > span { display: inline-block; transform: translateY(105%); transition: transform 1.1s var(--xs-ease); transition-delay: calc(var(--i) * 70ms); }
  :global(.in) .w > span { transform: none; }
  .hot { color: var(--xs-pink-2); }
  .txt { margin: 28px auto 0; max-width: 54ch; font-size: clamp(17px, 1.4vw, 21px); line-height: 1.6; color: var(--xs-muted); }
  .inner .xs-btn { margin-top: 40px; }
  .txt, .inner .xs-btn, .contact { opacity: 0; transform: translateY(18px); transition: opacity 0.9s ease 0.4s, transform 1s var(--xs-ease) 0.4s; }
  :global(.in) .txt, :global(.in) .xs-btn, :global(.in) .contact { opacity: 1; transform: none; }
  .contact { margin: 28px 0 0; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; font-size: 15px; color: var(--xs-muted); }
  .contact a { color: inherit; text-decoration: none; border-bottom: 1px solid var(--xs-line); transition: color 0.3s, border-color 0.3s; }
  .contact a:hover { color: var(--xs-pink-2); border-color: var(--xs-pink); }
</style>
