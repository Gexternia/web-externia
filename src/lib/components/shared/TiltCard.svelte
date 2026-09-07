<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    className?: string;
    children?: Snippet;
  }

  let { className = '', children }: Props = $props();

  let el = $state<HTMLDivElement | undefined>();
  let spotlight = $state({ x: 50, y: 50, opacity: 0 });

  function onMove(e: MouseEvent) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 100);
    const y = Math.round(((e.clientY - r.top) / r.height) * 100);
    spotlight = { x, y, opacity: 1 };
  }

  function onLeave() {
    spotlight = { ...spotlight, opacity: 0 };
  }
</script>

<div
  bind:this={el}
  onmousemove={onMove}
  onmouseleave={onLeave}
  class="relative overflow-hidden {className}"
>
  <!-- Interactive subtle spotlight beam -->
  <div
    class="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
    style="opacity: {spotlight.opacity}; background: radial-gradient(500px circle at {spotlight.x}% {spotlight.y}%, rgba(255, 255, 255, 0.08), transparent 45%);"
  ></div>
  {#if children}
    {@render children()}
  {/if}
</div>
