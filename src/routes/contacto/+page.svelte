<script lang="ts">
  import { onMount } from 'svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';
  import NetworkParticlesBg from '$lib/components/quienes-somos/NetworkParticlesBg.svelte';

  let isLight = $state(false);
  let NetworkParticlesCmp = $state<typeof NetworkParticlesBg | null>(null);

  // Mismos fondos que Servicios (claro y oscuro)
  const lightBg = 'bg-white/65 backdrop-blur-[2px]';
  const lightAltBg = 'bg-gray-50/65 backdrop-blur-[2px]';
  const darkBg = 'bg-[#060d1a]/72 backdrop-blur-[2px]';
  const darkAltBg = 'bg-[#08111e]/72 backdrop-blur-[2px]';
  function sectionBg(light: boolean, alt = false) {
    return light ? (alt ? lightAltBg : lightBg) : alt ? darkAltBg : darkBg;
  }

  let pillClass = $derived(
    isLight ? 'bg-brand-magenta/15 text-[#a82a5f]' : 'bg-white/15 text-blue-200'
  );

  onMount(() => {
    isLight = document.documentElement.classList.contains('light');
    const handler = () => {
      isLight = document.documentElement.classList.contains('light');
    };
    window.addEventListener('themechange', handler);
    import('$lib/components/quienes-somos/NetworkParticlesBg.svelte').then((mod) => {
      NetworkParticlesCmp = mod.default;
    });
    return () => window.removeEventListener('themechange', handler);
  });
</script>

<svelte:head>
  <title>Contáctanos — Externia AI for Events</title>
  <meta name="description" content="Contacta con Externia. Cuéntanos tu proyecto o evento." />
</svelte:head>

{#if NetworkParticlesCmp}
  <NetworkParticlesCmp {isLight} />
{/if}

<div class="relative min-h-screen z-10 overflow-hidden transition-colors duration-500 {isLight ? 'bg-white/65' : 'bg-[#060d1a]/72'}">
  <!-- Glows compartidos que se extienden por toda la página -->
  <div class="absolute top-1/4 -left-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-magenta' : 'bg-azul'}"></div>
  <div class="absolute top-3/4 -right-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-15 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-yellow' : 'bg-blue-900'}"></div>

  <!-- Hero -->
  <section class="section-divider relative flex flex-col items-center justify-center pt-24 pb-10 px-4 text-center">
    <FadeIn class="relative z-10">
      <span class="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-4 transition-colors duration-500 {pillClass}">
        Contáctanos
      </span>
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight max-w-3xl transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
        Hablemos de tu <span class="gradient-text-animate">próximo evento</span>
      </h1>
      <p class="mt-6 text-lg sm:text-xl max-w-xl mx-auto transition-colors duration-500 {isLight ? 'text-gray-600' : 'text-gray-200'}">
        Rellena el formulario y te respondemos sin compromiso.
      </p>
    </FadeIn>
  </section>

  <!-- Formulario sin fondo propio (lo hereda del contenedor) -->
  <ContactForm noBg />
</div>
