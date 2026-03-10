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

<div bind:this={el} class="text-3xl sm:text-4xl md:text-5xl font-black leading-snug tracking-tight text-white">
  {#each words as word, i}
    {@const isPhrase2 = i >= phrase2Start}
    {@const isHighlighted = !isLight && highlight.has(word)}
    <span
      class="inline-block mr-3 mb-2 transition-all duration-[450ms] ease-out"
      style="
        opacity: {inView ? 1 : 0};
        transform: translateY({inView ? 0 : 25}px);
        transition-delay: {i * 0.07}s;
        {isHighlighted ? 'color: #0070f3;' : ''}
        {isLight && isPhrase2 ? 'opacity: 1;' : isLight ? 'opacity: 0.8;' : ''}
      "
    >
      {word}
    </span>
  {/each}
</div>
