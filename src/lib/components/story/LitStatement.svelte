<script lang="ts">
  import { onMount } from 'svelte';
  import './story.css';
  import { seg, whileVisible } from './scroll';

  interface Props {
    text: string;
    /** words painted in brand pink once lit */
    strong?: string;
    /** small line under the statement */
    note?: string;
  }
  let { text, strong = '', note = '' }: Props = $props();

  const words = $derived(text.split(/\s+/).filter(Boolean));
  const hot = $derived(new Set(strong.split(/\s+/).filter(Boolean)));

  let el: HTMLElement;
  let lit = $state(0);

  onMount(() =>
    whileVisible(el, () => {
      const r = el.getBoundingClientRect();
      const vp = (innerHeight - r.top) / (r.height + innerHeight);
      el.style.setProperty('--xs-p', vp.toFixed(4));
      lit = Math.round(seg(vp, 0.22, 0.58) * words.length);
    })
  );
</script>

<section class="xs lit" bind:this={el}>
  <div class="xs-ambient" aria-hidden="true"><i class="a2"></i></div>
  <div class="xs-wrap">
    <span class="xs-bar mark" aria-hidden="true"></span>
    <p class="statement">
      {#each words as w, i}<span class:on={i < lit} class:hot={hot.has(w)}>{w}</span>{' '}{/each}
    </p>
    {#if note}<p class="note" class:on={lit >= words.length}>{note}</p>{/if}
  </div>
</section>

<style>
  .lit { padding: clamp(120px, 22vh, 240px) 0; overflow: hidden; }
  .mark { width: clamp(80px, 10vw, 140px); margin-bottom: 36px; transform-origin: left; transform: scaleX(calc(var(--xs-p, 0) * 2 - 0.3)); }
  .statement { margin: 0; font-size: clamp(36px, 5.6vw, 92px); font-weight: 800; line-height: 1.04; letter-spacing: -0.035em; max-width: 18ch; text-wrap: balance; }
  .statement span { color: var(--xs-faint); transition: color 0.4s ease; }
  .statement span.on { color: var(--xs-ink); }
  .statement span.on.hot { color: var(--xs-pink-2); }
  .note { margin: 32px 0 0; font-size: clamp(16px, 1.3vw, 19px); color: var(--xs-muted); opacity: 0; transform: translateY(14px); transition: opacity 0.8s ease, transform 0.9s var(--xs-ease); }
  .note.on { opacity: 1; transform: none; }
</style>
