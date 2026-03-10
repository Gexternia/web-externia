<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    value: number;
    suffix?: string;
    replay?: number;
  }

  let { value, suffix = '+', replay = 0 }: Props = $props();

  let el: HTMLSpanElement;
  let n = $state(0);

  function runCount() {
    n = 0;
    const end = Date.now() + 2200;
    const tick = () => {
      const t = Math.min(1, 1 - (end - Date.now()) / 2200);
      n = Math.round((1 - Math.pow(1 - t, 3)) * value);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  onMount(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) runCount(); },
      { rootMargin: '-80px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  });

  $effect(() => {
    if (replay > 0 && typeof window !== 'undefined' && el) runCount();
  });
</script>

<span bind:this={el}>{n.toLocaleString('es-ES')}{suffix}</span>
