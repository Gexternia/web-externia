<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    words: string[];
    highlight?: Set<string>;
    isLight?: boolean;
    phrase2Start?: number;
  }

  let { words, highlight = new Set(), isLight = false, phrase2Start = 9 }: Props = $props();

  let el: HTMLDivElement;
  let inView = $state(false);

  onMount(() => {
    const obs = new IntersectionObserver(
      ([e]) => { inView = e.isIntersecting; },
      { rootMargin: '-80px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<div
  bind:this={el}
  class="text-3xl sm:text-4xl md:text-5xl font-black leading-snug tracking-tight {isLight ? 'text-black' : 'text-white'}"
  style="text-shadow: {isLight
    ? '0 2px 8px rgba(222, 59, 132, 0.4), 0 4px 16px rgba(214, 0, 125, 0.25), 0 0 24px rgba(255, 193, 45, 0.15)'
    : '0 2px 8px rgba(0, 112, 243, 0.5), 0 4px 16px rgba(59, 130, 246, 0.3), 0 0 24px rgba(59, 130, 246, 0.2)'};"
>
  {#each words as word, i}
    {@const isPhrase2 = i >= phrase2Start}
    {@const isHighlighted = highlight.has(word)}
    <span
      class="inline-block mr-3 mb-2 transition-all duration-[450ms] ease-out {isHighlighted ? 'gradient-text-animate' : ''}"
      style="
        opacity: {inView ? 1 : 0};
        transform: translateY({inView ? 0 : 25}px);
        transition-delay: {i * 0.07}s;
        {isLight && isPhrase2 ? 'opacity: 1;' : isLight ? 'opacity: 0.95;' : ''}
      "
    >
      {word}
    </span>
  {/each}
</div>
