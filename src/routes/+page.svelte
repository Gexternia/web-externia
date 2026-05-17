<script lang="ts">
  import { onMount } from 'svelte';
  import HeroContent from '$lib/components/HeroContent.svelte';

  let Scene3DCmp = $state<typeof import('$lib/components/Scene3D.svelte').default | null>(null);

  onMount(() => {
    const loadScene = () => {
      void import('$lib/components/Scene3D.svelte').then((mod) => {
        Scene3DCmp = mod.default;
      });
    };

    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(loadScene, { timeout: 600 });
      return () => cancelIdleCallback(id);
    }

    const id = window.setTimeout(loadScene, 150);
    return () => clearTimeout(id);
  });
</script>

<section
  id="hero"
  class="relative w-full h-screen overflow-hidden"
  style="background-color: var(--bg-base); transition: background-color 0.4s ease;"
>
  <div class="absolute inset-0">
    {#if Scene3DCmp}
      <Scene3DCmp />
    {/if}
  </div>
  <div
    class="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
    style="background: linear-gradient(to bottom, transparent, var(--bg-base)); transition: background 0.4s ease;"
  ></div>
  <HeroContent />
</section>
