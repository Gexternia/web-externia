<script lang="ts">
  import { onMount } from 'svelte';
  import { particlesInit } from '@tsparticles/svelte';
  import { loadSlim } from '@tsparticles/slim';

  let { isLight = false }: { isLight?: boolean } = $props();

  let ParticlesCmp = $state<typeof import('@tsparticles/svelte').default | null>(null);
  let ready = $state(false);
  let isMobile = $state(false);

  onMount(() => {
    let cancelled = false;
    isMobile = window.innerWidth < 768 || ('ontouchstart' in window && window.innerWidth < 1024);
    
    const load = async () => {
      const [mod] = await Promise.all([
        import('@tsparticles/svelte'),
        particlesInit(async (engine) => loadSlim(engine)),
      ]);
      if (cancelled) return;
      ParticlesCmp = mod.default;
      ready = true;
    };
    const id = window.setTimeout(() => void load(), 120);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  });

  const accent = $derived(isLight ? '#DE3B84' : '#0070f3');
</script>

{#if ready && ParticlesCmp}
  <ParticlesCmp
    id="qs-network"
    style="position: fixed; inset: 0; z-index: 5; pointer-events: none"
    options={{
      fpsLimit: 30,
      background: { color: { value: 'transparent' } },
      interactivity: {
        detectsOn: 'window' as const,
        events: { onHover: { enable: false }, onClick: { enable: false } },
      },
      particles: {
        color: { value: accent },
        links: {
          enable: true,
          color: accent,
          opacity: isMobile ? 0.75 : 0.9,
          distance: isMobile ? 85 : 105,
          width: isMobile ? 1.8 : 2.2,
        },
        move: {
          enable: true,
          speed: isMobile ? 0.35 : 0.45,
          random: true,
          direction: 'none' as const,
          outModes: { default: 'bounce' as const },
        },
        number: { density: { enable: true }, value: isMobile ? 12 : 20 },
        opacity: { value: { min: 0.8, max: 1.0 } },
        size: { value: { min: isMobile ? 3 : 4, max: isMobile ? 4.5 : 5.5 } },
        shape: { type: 'circle' },
      },
      detectRetina: false,
    }}
  />
{/if}
