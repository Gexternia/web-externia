<script lang="ts">
  import './story.css';
  import { reveal } from './reveal';

  interface Item { title: string; desc?: string }
  interface Props {
    heading: string;
    /** words of the heading in brand pink */
    accent?: string;
    sub?: string;
    items: Item[];
    numbered?: boolean;
    alt?: boolean;
  }
  let { heading, accent = '', sub = '', items, numbered = false, alt = false }: Props = $props();
  const hot = $derived(new Set(accent.split(/\s+/).filter(Boolean)));
</script>

<section class="xs xs-section list" class:alt>
  <div class="xs-wrap">
    <div class="head" data-rv use:reveal>
      <h2 class="xs-h2">{#each heading.split(/\s+/) as w}{#if hot.has(w)}<em>{w}</em>{:else}{w}{/if}{' '}{/each}</h2>
      {#if sub}<p class="xs-lead">{sub}</p>{/if}
    </div>
    <ol class="rows" class:numbered>
      {#each items as it, i}
        <li data-rv use:reveal style="--d: {(i % 4) * 70}ms">
          <span class="idx" aria-hidden="true">{numbered ? String(i + 1).padStart(2, '0') : ''}<span class="xs-bar"></span></span>
          <h3>{it.title}</h3>
          {#if it.desc}<p>{it.desc}</p>{/if}
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .alt { background-color: var(--xs-bg-2); }
  .head { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px 64px; align-items: end; margin-bottom: clamp(40px, 7vh, 72px); }
  .head .xs-h2 { font-size: clamp(36px, 5vw, 80px); }
  .rows { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--xs-line); }
  li { position: relative; display: grid; grid-template-columns: 120px 1fr 1fr; gap: 12px 40px; align-items: baseline; padding: clamp(24px, 4vh, 40px) 0; border-bottom: 1px solid var(--xs-line); }
  li::before { content: ''; position: absolute; inset: 0 calc(clamp(16px, 4vw, 48px) * -1); z-index: -1; background: var(--xs-faint); transform: scaleY(0); transform-origin: bottom; transition: transform 0.5s var(--xs-ease); }
  li:hover::before { transform: scaleY(1); }
  .idx { display: flex; flex-direction: column; gap: 10px; font-size: 14px; font-weight: 800; letter-spacing: 0.1em; color: var(--xs-pink-2); }
  .idx .xs-bar { width: 56px; height: 6px; transform-origin: left; transform: scaleX(0); transition: transform 1s var(--xs-ease) 0.2s; }
  li:global(.in) .idx .xs-bar { transform: scaleX(1); }
  li:hover .idx .xs-bar { transform: scaleX(1.5); }
  h3 { margin: 0; font-size: clamp(22px, 2.3vw, 36px); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; transition: transform 0.5s var(--xs-ease); }
  li:hover h3 { transform: translateX(6px); }
  li p { margin: 0; font-size: clamp(15px, 1.15vw, 18px); line-height: 1.6; color: var(--xs-muted); }
  .rows:not(.numbered) .idx { justify-content: center; }

  @media (max-width: 900px) {
    .head { grid-template-columns: 1fr; }
    li { grid-template-columns: 1fr; gap: 10px; }
  }
</style>
