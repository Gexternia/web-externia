<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';

  interface Props {
    delay?: number;
    from?: 'bottom' | 'left' | 'right';
    className?: string;
  }

  let { delay = 0, from = 'bottom', className = '' }: Props = $props();

  let el: HTMLDivElement;
  let visible = $state(false);
  const opacity = spring(0, { stiffness: 0.5, damping: 0.6 });
  const x = spring(from === 'left' ? -50 : from === 'right' ? 50 : 0, { stiffness: 0.5, damping: 0.6 });
  const y = spring(from === 'bottom' ? 45 : 0, { stiffness: 0.5, damping: 0.6 });

  onMount(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !visible) {
          visible = true;
          setTimeout(() => {
            opacity.set(1);
            x.set(0);
            y.set(0);
          }, delay * 1000);
        }
      },
      { rootMargin: '-60px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  });
</script>

<div
  bind:this={el}
  class={className}
  style="opacity: {$opacity}; transform: translate({$x}px, {$y}px)"
>
  <slot />
</div>
