<script lang="ts">
  import { onMount } from 'svelte';
  import NetworkParticlesBg from '$lib/components/quienes-somos/NetworkParticlesBg.svelte';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';
  import SectionLabel from '$lib/components/shared/SectionLabel.svelte';
  import MagneticRepel from '$lib/components/shared/MagneticRepel.svelte';

  let isLight = $state(false);
  let NetworkParticlesCmp = $state<typeof NetworkParticlesBg | null>(null);

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

  const lightBg = 'bg-white/65 backdrop-blur-[2px]';
  const lightAltBg = 'bg-gray-50/65 backdrop-blur-[2px]';
  const darkBg = 'bg-[#060d1a]/72 backdrop-blur-[2px]';
  const darkAltBg = 'bg-[#08111e]/72 backdrop-blur-[2px]';

  function sectionBg(light: boolean, alt = false) {
    return light ? (alt ? lightAltBg : lightBg) : alt ? darkAltBg : darkBg;
  }

  const phases = [
    { num: '01', title: 'CRE-IA-tividad', icon: '💡', desc: 'Exploración del contexto del evento, los objetivos de la marca y el perfil de los asistentes. Co-creación mediante brainstorming aumentado con IA.', colorLight: '#DE3B84', colorDark: '#0070f3' },
    { num: '02', title: 'AI-mplementación', icon: '⚙️', desc: 'Desarrollo e integración ágil de la solución elegida. La tecnología se adapta al espacio, el tiempo y el equipo humano del evento.', colorLight: '#FFC12D', colorDark: '#3b82f6' },
    { num: '03', title: 'Evolución y Optimización', icon: '📊', desc: 'Monitorización en tiempo real, feedback e informes de impacto medibles. Auditorías de IA y asesoramiento en la Ley de IA de la UE.', colorLight: '#F7A361', colorDark: '#60a5fa' },
  ];

  const extras = [
    { icon: '🔍', label: 'Auditorías de IA' },
    { icon: '🗺️', label: 'Hojas de ruta tecnológicas' },
    { icon: '⚖️', label: 'Cumplimiento Ley IA UE' },
    { icon: '🌱', label: 'Soluciones neutras en carbono' },
  ];

  let ctaHovered = $state(false);
  let primaryRef: HTMLSpanElement;
  let cloneRef: HTMLSpanElement;
  const TR = 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)';

  function onBtnEnter() {
    ctaHovered = true;
    if (!primaryRef || !cloneRef) return;
    primaryRef.style.transition = 'none';
    primaryRef.style.transform = 'translateX(0%)';
    cloneRef.style.transition = 'none';
    cloneRef.style.transform = 'translateX(-110%)';
    primaryRef.getBoundingClientRect();
    primaryRef.style.transition = TR;
    primaryRef.style.transform = 'translateX(110%)';
    cloneRef.style.transition = TR;
    cloneRef.style.transform = 'translateX(0%)';
  }

  function onBtnLeave() {
    ctaHovered = false;
    if (!primaryRef || !cloneRef) return;
    primaryRef.style.transition = 'none';
    primaryRef.style.transform = 'translateX(-110%)';
    cloneRef.style.transition = 'none';
    cloneRef.style.transform = 'translateX(0%)';
    cloneRef.getBoundingClientRect();
    cloneRef.style.transition = TR;
    cloneRef.style.transform = 'translateX(110%)';
    primaryRef.style.transition = TR;
    primaryRef.style.transform = 'translateX(0%)';
  }
</script>

<svelte:head>
  <title>Consultoría — Externia AI for Events</title>
  <meta name="description" content="Consultoría estratégica de IA para eventos. Integración real, no genérica, diseñada para el sector MICE." />
</svelte:head>

{#if NetworkParticlesCmp}
  <NetworkParticlesCmp {isLight} />
{/if}

<div class="relative z-10 transition-colors duration-500">
  <!-- Hero -->
  <section class="relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-4 text-center transition-colors duration-500 {sectionBg(isLight)}">
    <div class="absolute top-1/4 -left-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none {isLight ? 'bg-brand-magenta' : 'bg-azul'}"></div>
    <div class="absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none {isLight ? 'bg-brand-yellow' : 'bg-blue-900'}"></div>

    <FadeIn delay={0.1} className="relative z-10 mb-6">
      <SectionLabel text="Consultoría Estratégica" {isLight} />
    </FadeIn>

    <FadeIn delay={0.2}>
      <h1 class="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight max-w-5xl transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
        Consultoría Estratégica de <span class="gradient-text-animate">IA</span>
      </h1>
    </FadeIn>

    <FadeIn delay={0.4}>
      <p class="relative z-10 mt-6 text-lg sm:text-xl max-w-2xl leading-relaxed transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-300'}">
        Integración real, no genérica. Diseñada específicamente para el sector de los eventos,
        con el conocimiento de quienes lo conocen desde dentro.
      </p>
    </FadeIn>
  </section>

  <!-- Contenido principal -->
  <section class="section-divider relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-20">
        <SectionLabel text="Consultoría Estratégica de IA" {isLight} />
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Integración real, <span class="gradient-text-animate">no genérica</span>
        </h2>
        <p class="mt-4 text-base max-w-xl mx-auto transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Diseñada específicamente para el sector de los eventos, con el conocimiento de quienes lo conocen desde dentro.
        </p>
      </FadeIn>

      <div class="relative">
        <div class="hidden lg:block absolute top-10 left-[16.66%] right-[16.66%] h-px {isLight ? 'bg-gradient-to-r from-brand-magenta via-brand-yellow to-brand-orange' : 'bg-gradient-to-r from-azul/40 to-blue-400/40'}"></div>
        <div class="grid lg:grid-cols-3 gap-10">
          {#each phases as phase, i}
            <MagneticRepel strength={12} radius={160}>
              <FadeIn delay={i * 0.15}>
                <div class="flex flex-col items-center text-center p-8 rounded-2xl border transition-all duration-300 {isLight ? 'bg-white/90 border-gray-100 backdrop-blur-sm' : 'bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/40 backdrop-blur-sm'}">
                  <div
                    class="relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white mb-6 shadow-xl transition-transform duration-300 hover:scale-110"
                    style="background-color: {isLight ? phase.colorLight : phase.colorDark}"
                  >
                    <span>{phase.num}</span>
                    <div class="absolute inset-0 rounded-full opacity-40 blur-md" style="background-color: {isLight ? phase.colorLight : phase.colorDark}"></div>
                  </div>
                  <div class="text-3xl mb-3 select-none">{phase.icon}</div>
                  <h3 class="text-xl font-black mb-3 {isLight ? 'text-gray-900' : 'text-white'}">
                    {#each phase.title.split('-') as part, pi}
                      {#if part === 'IA'}
                        <span style="color: {isLight ? phase.colorLight : phase.colorDark}">IA</span>
                      {:else}
                        {part}{pi < phase.title.split('-').length - 1 ? '-' : ''}
                      {/if}
                    {/each}
                  </h3>
                  <p class="text-sm leading-relaxed {isLight ? 'text-gray-500' : 'text-gray-400'}">{phase.desc}</p>
                </div>
              </FadeIn>
            </MagneticRepel>
          {/each}
        </div>
      </div>

      <FadeIn delay={0.3} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {#each extras as e}
          <div class="flex items-center gap-3 p-4 rounded-2xl border transition-colors duration-500 {isLight ? 'shadow-card-light bg-white/80 border-gray-100' : 'bg-[#0d1829]/60 border-white/8'}">
            <span class="text-2xl">{e.icon}</span>
            <span class="text-sm font-semibold {isLight ? 'text-gray-700' : 'text-gray-300'}">{e.label}</span>
          </div>
        {/each}
      </FadeIn>
    </div>
  </section>

  <!-- CTA -->
  <section class="section-divider relative py-32 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-12 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-magenta' : 'bg-azul'}"></div>

    <div class="max-w-3xl mx-auto text-center relative z-10">
      <FadeIn>
        <SectionLabel text="¿Hablamos?" {isLight} />
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Integremos la <span class="gradient-text-animate">IA</span> en tu estrategia
        </h2>
        <p class="text-lg mb-10 transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Cuéntanos tu proyecto y te acompañamos en la integración estratégica de la IA.
        </p>

        <a
          href="/contacto"
          class="btn-cta-animated micro-active-press relative inline-block overflow-hidden px-12 py-5 rounded-full text-lg font-bold text-white transition-all duration-300 hover:scale-105 {isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia' : 'bg-azul'}"
          style={ctaHovered ? (isLight ? 'box-shadow: 0 0 50px #DE3B8490, 0 0 100px #D6007D40' : 'box-shadow: 0 0 50px #0070f390, 0 0 100px #0070f340') : ''}
          onmouseenter={onBtnEnter}
          onmouseleave={onBtnLeave}
        >
          <span class="invisible whitespace-nowrap">Contactar ahora →</span>
          <span bind:this={primaryRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(0%)">Contactar ahora →</span>
          <span bind:this={cloneRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(-110%)">Contactar ahora →</span>
        </a>
      </FadeIn>
    </div>
  </section>
</div>
