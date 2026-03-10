<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { subscribe } from '$lib/utils/globalMouse';

  interface Props {
    strength?: number;
    radius?: number;
  }

  let { strength = 52, radius = 185 }: Props = $props();

  let el: HTMLDivElement;
  const x = spring(0, { stiffness: 160, damping: 18 });
  const y = spring(0, { stiffness: 160, damping: 18 });

  onMount(() => {
    const cb = (mx: number, my: number) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = mx - (r.left + r.width * 0.5);
      const dy = my - (r.top + r.height * 0.5);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius && dist > 0) {
        const force = (1 - dist / radius) * strength;
        x.set((-dx / dist) * force);
        y.set((-dy / dist) * force);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    const unsub = subscribe(cb);
    return unsub;
  });
</script>

<div bind:this={el} style="transform: translate({$x}px, {$y}px)">
  <slot />
</div>
