<script lang="ts">
  import Scene3D from '$lib/components/Scene3D.svelte';
  import HeroContent from '$lib/components/HeroContent.svelte';
</script>

<section
  id="hero"
  class="relative w-full h-screen overflow-hidden"
  style="background-color: var(--bg-base); transition: background-color 0.4s ease;"
>
  <div class="absolute inset-0">
    <Scene3D />
  </div>
  <div
    class="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
    style="background: linear-gradient(to bottom, transparent, var(--bg-base)); transition: background 0.4s ease;"
  ></div>
  <HeroContent />
</section>
