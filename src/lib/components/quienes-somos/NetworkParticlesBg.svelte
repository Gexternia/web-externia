<script lang="ts">
  import { onMount } from 'svelte';
  import { particlesInit } from '@tsparticles/svelte';
  import { loadSlim } from '@tsparticles/slim';

  let { isLight = false }: { isLight?: boolean } = $props();

  let ParticlesCmp = $state<typeof import('@tsparticles/svelte').default | null>(null);
  let ready = $state(false);

  onMount(async () => {
    let cancelled = false;
    const load = async () => {
      const [mod] = await Promise.all([
        import('@tsparticles/svelte'),
        particlesInit(async (engine) => loadSlim(engine)),
      ]);
      if (cancelled) return;
      ParticlesCmp = mod.default;
      ready = true;
    };
    const id = window.setTimeout(() => load(), 120);
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
      fpsLimit: 40,
      background: { color: { value: 'transparent' } },
      interactivity: {
        detectsOn: 'window' as const,
        events: { onHover: { enable: true, mode: 'repulse' }, onClick: { enable: true, mode: 'push' } },
        modes: { repulse: { distance: 100, duration: 0.4, factor: 3 }, push: { quantity: 1 } },
      },
      particles: {
        color: { value: accent },
        links: {
          enable: true,
          color: accent,
          opacity: isLight ? 0.58 : 1.0,
          distance: 130,
          width: 1.8,
        },
        move: {
          enable: true,
          speed: 0.6,
          random: true,
          direction: 'none' as const,
          outModes: { default: 'bounce' as const },
        },
        number: { density: { enable: true, area: 1100 }, value: 32 },
        opacity: { value: { min: isLight ? 0.49 : 0.65, max: isLight ? 0.75 : 1.0 } },
        size: { value: { min: 2.5, max: 4 } },
        shape: { type: 'circle' },
      },
      detectRetina: false,
    }}
  />
{/if}
