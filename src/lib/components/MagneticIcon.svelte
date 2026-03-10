<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';

  let el: HTMLDivElement;
  const x = spring(0, { stiffness: 250, damping: 20 });
  const y = spring(0, { stiffness: 250, damping: 20 });

  onMount(() => {
    const onMove = (e: MouseEvent) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width * 0.5);
      const dy = e.clientY - (r.top + r.height * 0.5);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 32;
      const strength = 4;
      if (dist < radius && dist > 0) {
        const force = (1 - dist / radius) * strength;
        x.set((dx / dist) * force);
        y.set((dy / dist) * force);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  });
</script>

<div
  bind:this={el}
  class="inline-flex"
  style="transform: translate({$x}px, {$y}px)"
>
  <slot />
</div>
