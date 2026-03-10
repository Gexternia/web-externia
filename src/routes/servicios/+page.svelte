<script lang="ts">
  import { onMount } from 'svelte';
  import NetworkParticlesBg from '$lib/components/quienes-somos/NetworkParticlesBg.svelte';
  import WheelCarousel from '$lib/components/servicios/WheelCarousel.svelte';
  import SlideButton from '$lib/components/servicios/SlideButton.svelte';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';
  import SectionLabel from '$lib/components/shared/SectionLabel.svelte';
  import MagneticRepel from '$lib/components/shared/MagneticRepel.svelte';
  import MagneticAttract from '$lib/components/shared/MagneticAttract.svelte';

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

  const ACTIVATION_CARDS = [
    { emoji: '🖌️', category: 'Transformación Creativa', title: 'Smart Brush', desc: 'El asistente dibuja sobre una tableta y la IA transforma su trazo en una creación artística de alta calidad en tiempo real.', ideal: 'Stands en ferias, networking corporativo, lanzamientos de producto', gradientLight: 'from-[#DE3B84] via-[#D6007D] to-[#a8005f]', gradientDark: 'from-[#0070f3] via-[#0050c8] to-[#003a99]' },
    { emoji: '📡', category: 'Transformación Creativa', title: 'Smart Brush Live', desc: 'Versión amplificada del Smart Brush diseñada para grandes audiencias. Las creaciones se proyectan en pantalla gigante en tiempo real.', ideal: 'Conferencias, gala dinners, keynotes, espacios de gran afluencia', gradientLight: 'from-[#D6007D] via-[#c0006e] to-[#8a004f]', gradientDark: 'from-[#0060d0] via-[#0048b0] to-[#003080]' },
    { emoji: '🎨', category: 'Transformación Creativa', title: 'Sorolla Brush', desc: 'Los bocetos de los asistentes se transforman en obras al estilo del pintor valenciano Joaquín Sorolla.', ideal: 'Eventos institucionales, patrocinios culturales, marcas premium y de lujo', gradientLight: 'from-[#FFC12D] via-[#F7A361] to-[#e08040]', gradientDark: 'from-[#1a4fa8] via-[#1040a0] to-[#0a2878]' },
    { emoji: '🔮', category: 'Entretenimiento Personalizado', title: 'Mystic Oracle', desc: "Una 'pitonisa digital' que analiza la imagen de la palma de la mano mediante visión artificial y genera una predicción personalizada.", ideal: 'Activaciones de marca, eventos temáticos, inauguraciones, cenas de gala', gradientLight: 'from-[#EE847B] via-[#DE3B84] to-[#b02060]', gradientDark: 'from-[#2860c0] via-[#1850a8] to-[#083890]' },
    { emoji: '😄', category: 'Entretenimiento Personalizado', title: 'Carizaturízame', desc: 'La IA redefine el arte de la caricatura: genera retratos humorísticos e hiperpersonalizados. Más de 2.300 caricaturas en un solo evento.', ideal: 'Ferias, eventos masivos, stands con alto tráfico de visitantes', gradientLight: 'from-[#DE3B84] via-[#EE847B] to-[#F7A361]', gradientDark: 'from-[#0070f3] via-[#1a60d0] to-[#3050b0]' },
    { emoji: '🐼', category: 'Entretenimiento Personalizado', title: 'Pandarízate', desc: 'Activación lúdica que transforma a los asistentes en adorables personajes panda. Resultados virales garantizados.', ideal: 'Teambuilding, lanzamientos desenfadados, activaciones para redes sociales', gradientLight: 'from-[#F7A361] via-[#EE847B] to-[#DE3B84]', gradientDark: 'from-[#1858c0] via-[#0c48a8] to-[#063890]' },
    { emoji: '👗', category: 'Identidad y Estilo', title: 'Look A Like', desc: 'Sistema de IA que analiza el estilo del asistente y lo compara con tendencias de moda, generando una visualización personalizada.', ideal: 'Eventos de marcas de moda, retail, grandes almacenes, lifestyle', gradientLight: 'from-[#D6007D] via-[#DE3B84] to-[#EE847B]', gradientDark: 'from-[#004fc0] via-[#0060d0] to-[#1070e0]' },
    { emoji: '🤖', category: 'Identidad y Estilo', title: 'Avatar Motion', desc: 'Transformamos a cada asistente en un avatar digital personalizado que captura su esencia.', ideal: 'Eventos tecnológicos, lanzamientos de producto, mundos de marca inmersivos', gradientLight: 'from-[#DE3B84] via-[#D6007D] to-[#FFC12D]', gradientDark: 'from-[#0070f3] via-[#0068e0] to-[#3088ff]' },
  ];

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

  const programs = [
    { icon: '🌱', title: 'Taller Introductorio', level: 'Nivel básico', desc: 'Para equipos que quieren empezar a usar la IA de forma práctica y rápida. Resultados visibles desde la primera sesión.', gradient: 'from-[#DE3B84]/8 to-[#FFC12D]/4', hoverLight: 'hover:border-[#DE3B84]/50' },
    { icon: '🚀', title: 'Programa Avanzado', level: 'Nivel estratégico', desc: 'Para profesionales que buscan una visión completa: herramientas, flujos de trabajo, casos de uso y aplicación al negocio de eventos.', gradient: 'from-[#FFC12D]/8 to-[#F7A361]/4', hoverLight: 'hover:border-[#FFC12D]/50' },
    { icon: '🎯', title: 'Formación a Medida', level: 'Personalizado', desc: 'Programas específicos para agencias o departamentos, incluyendo formatos presenciales, online e híbridos.', gradient: 'from-[#F7A361]/8 to-[#EE847B]/4', hoverLight: 'hover:border-[#F7A361]/50' },
  ];

  const paraQuienTypes = [
    { icon: '🏷️', title: 'Activaciones de marca', desc: 'Donde el objetivo es generar efecto WOW y conexión emocional entre los asistentes y la marca.' },
    { icon: '🏢', title: 'Eventos corporativos', desc: 'Para enriquecer momentos de networking, entretener en cenas de gala y crear oportunidades de patrocinio únicas.' },
    { icon: '🎪', title: 'Ferias y congresos', desc: 'Para atraer un alto volumen de visitantes, captar su atención y dejar una impresión duradera.' },
    { icon: '🤝', title: 'Teambuilding e incentivos', desc: 'Activaciones lúdicas que refuerzan la cohesión de equipo y generan recuerdos compartidos.' },
  ];

  const categories = [
    { icon: '🖌️', label: 'Transformación Creativa', count: 3 },
    { icon: '🎭', label: 'Entretenimiento Personalizado', count: 3 },
    { icon: '👗', label: 'Identidad y Estilo', count: 2 },
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
  <title>Servicios — Externia AI for Events</title>
  <meta name="description" content="Servicios de IA para eventos. Activaciones, consultoría y formación." />
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
      <SectionLabel text="Nuestros Servicios" {isLight} />
    </FadeIn>

    <FadeIn delay={0.2}>
      <h1 class="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight max-w-5xl transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
        Experiencias de <span class={isLight ? 'bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-brand-orange bg-clip-text text-transparent' : 'bg-gradient-to-r from-[#0070f3] via-blue-300 to-[#0070f3] bg-clip-text text-transparent'}>IA</span><br />que impactan
      </h1>
    </FadeIn>

    <FadeIn delay={0.4}>
      <p class="relative z-10 mt-6 text-lg sm:text-xl max-w-2xl leading-relaxed transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-300'}">
        Activaciones experienciales, consultoría estratégica y formación especializada —
        todo bajo la filosofía <strong>MAPI</strong>: Medible, Asequible, Personalizado e Innovador.
      </p>
    </FadeIn>

    <FadeIn delay={0.6} className="relative z-10 mt-10 flex flex-wrap justify-center gap-4">
      <SlideButton href="#activaciones" label="Activaciones" icon="🎯" {isLight} />
      <SlideButton href="#consultoria" label="Consultoría" icon="🧠" {isLight} />
      <SlideButton href="#formacion" label="Formación" icon="📚" {isLight} />
    </FadeIn>
  </section>

  <!-- Activaciones -->
  <section id="activaciones" class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-20">
        <SectionLabel text="01 · Activaciones de IA Experiencial" {isLight} />
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Instalaciones que <span class={isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia bg-clip-text text-transparent' : 'bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent'}>sorprenden</span>
        </h2>
        <p class="mt-2 text-base max-w-xl mx-auto transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          8 activaciones interactivas agrupadas en 3 líneas temáticas. Arrastra las tarjetas para explorarlas.
        </p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <WheelCarousel cards={ACTIVATION_CARDS} {isLight} />
      </FadeIn>

      <FadeIn delay={0.35} className="mt-24 flex flex-wrap justify-center gap-6">
        {#each categories as cat}
          <div class="flex items-center gap-3 px-5 py-3 rounded-2xl border transition-colors duration-500 {isLight ? 'bg-white/80 border-gray-100' : 'bg-[#0d1829]/80 border-white/8'}">
            <span class="text-xl">{cat.icon}</span>
            <div>
              <p class="text-xs font-bold {isLight ? 'text-gray-900' : 'text-white'}">{cat.label}</p>
              <p class="text-xs {isLight ? 'text-gray-400' : 'text-gray-500'}">{cat.count} activaciones</p>
            </div>
          </div>
        {/each}
      </FadeIn>
    </div>
  </section>

  <!-- Consultoría -->
  <section id="consultoria" class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-20">
        <SectionLabel text="02 · Consultoría Estratégica de IA" {isLight} />
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Integración real, <span class={isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-orange bg-clip-text text-transparent' : 'bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent'}>no genérica</span>
        </h2>
        <p class="mt-4 text-base max-w-xl mx-auto transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Diseñada específicamente para el sector de los eventos, con el conocimiento de quienes lo conocen desde dentro.
        </p>
      </FadeIn>

      <div class="relative">
        <div class="hidden lg:block absolute top-10 left-[16.66%] right-[16.66%] h-px {isLight ? 'bg-gradient-to-r from-brand-magenta via-brand-yellow to-brand-orange' : 'bg-gradient-to-r from-azul/40 to-blue-400/40'}"></div>
        <div class="grid lg:grid-cols-3 gap-10">
          {#each phases as phase, i}
            <MagneticRepel strength={40} radius={160}>
              <FadeIn delay={i * 0.15}>
                <div class="flex flex-col items-center text-center p-8 rounded-2xl border transition-all duration-300 {isLight ? 'bg-white/90 border-gray-100 backdrop-blur-sm' : 'bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/40 backdrop-blur-sm'}">
                  <div
                    class="relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white mb-6 shadow-xl transition-transform duration-300 hover:scale-110"
                    style="background-color: {isLight ? phase.colorLight : phase.colorDark}"
                  >
                    <MagneticAttract strength={16} radius={65}>
                      <span>{phase.num}</span>
                    </MagneticAttract>
                    <div class="absolute inset-0 rounded-full opacity-40 blur-md" style="background-color: {isLight ? phase.colorLight : phase.colorDark}"></div>
                  </div>
                  <div class="text-3xl mb-3">{phase.icon}</div>
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
          <div class="flex items-center gap-3 p-4 rounded-2xl border transition-colors duration-500 {isLight ? 'bg-white/80 border-gray-100' : 'bg-[#0d1829]/60 border-white/8'}">
            <MagneticAttract strength={14} radius={55}>
              <span class="text-2xl">{e.icon}</span>
            </MagneticAttract>
            <span class="text-sm font-semibold {isLight ? 'text-gray-700' : 'text-gray-300'}">{e.label}</span>
          </div>
        {/each}
      </FadeIn>
    </div>
  </section>

  <!-- Formación -->
  <section id="formacion" class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-16">
        <SectionLabel text="03 · Formación Especializada" {isLight} />
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          IA aplicada al <span class={isLight ? 'bg-gradient-to-r from-brand-fuchsia to-brand-magenta bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-300 to-azul bg-clip-text text-transparent'}>sector MICE</span>
        </h2>
        <p class="mt-4 text-base max-w-xl mx-auto transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          No enseñamos IA genérica. Enseñamos IA aplicada a las necesidades de quienes organizan, producen y venden eventos.
        </p>
      </FadeIn>

      <div class="grid md:grid-cols-3 gap-6">
        {#each programs as p, i}
          <MagneticRepel strength={45} radius={175}>
            <FadeIn delay={i * 0.12}>
              <div class="h-full p-7 rounded-2xl border transition-all duration-300 cursor-default {isLight ? `bg-gradient-to-br ${p.gradient} bg-white/90 border-gray-100 ${p.hoverLight} backdrop-blur-sm` : 'bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/45 hover:bg-[#00c8ff]/6 backdrop-blur-sm'}">
                <MagneticAttract strength={18} radius={70}>
                  <div class="text-4xl mb-5">{p.icon}</div>
                </MagneticAttract>
                <div class="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 {isLight ? 'bg-brand-magenta/10 text-brand-magenta' : 'bg-azul/10 text-azul'}">{p.level}</div>
                <h3 class="text-lg font-black mb-3 {isLight ? 'text-gray-900' : 'text-white'}">{p.title}</h3>
                <p class="text-sm leading-relaxed {isLight ? 'text-gray-500' : 'text-gray-400'}">{p.desc}</p>
              </div>
            </FadeIn>
          </MagneticRepel>
        {/each}
      </div>
    </div>
  </section>

  <!-- Para quién -->
  <section class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {isLight ? 'bg-gradient-to-br from-[#f0a0c0] via-[#dc80c8] to-[#f8c090]' : 'bg-[#060d1a]/95 backdrop-blur-sm'}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-16">
        <SectionLabel text="¿Para qué eventos?" {isLight} white={isLight} />
        <h2 class="text-4xl sm:text-5xl font-black text-white">
          Diseñados para el <span class={isLight ? 'text-white' : 'bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent'}>impacto real</span>
        </h2>
      </FadeIn>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {#each paraQuienTypes as t, i}
          <FadeIn delay={i * 0.1}>
            <MagneticRepel strength={38} radius={155}>
              <div class="p-6 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 {isLight ? 'bg-white/15 border-white/25 backdrop-blur-sm hover:bg-white/25' : 'bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/40 backdrop-blur-sm'}">
                <MagneticAttract strength={16} radius={60}>
                  <div class="text-4xl mb-4">{t.icon}</div>
                </MagneticAttract>
                <h3 class="text-base font-black text-white mb-2">{t.title}</h3>
                <p class="text-xs leading-relaxed {isLight ? 'text-white/75' : 'text-gray-400'}">{t.desc}</p>
              </div>
            </MagneticRepel>
          </FadeIn>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="relative py-32 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-12 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-magenta' : 'bg-azul'}"></div>

    <div class="max-w-3xl mx-auto text-center relative z-10">
      <FadeIn>
        <SectionLabel text="Diseñemos juntos" {isLight} />
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Tu próxima experiencia <span class={isLight ? 'bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-brand-orange bg-clip-text text-transparent' : 'bg-gradient-to-r from-azul via-blue-300 to-azul bg-clip-text text-transparent'}>inolvidable</span>
        </h2>
        <p class="text-lg mb-10 transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Cuéntanos tu evento y te proponemos la solución MAPI perfecta para él.
        </p>

        <a
          href="/contacto"
          class="relative inline-block overflow-hidden px-12 py-5 rounded-full text-lg font-bold text-white transition-shadow duration-300 {isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia' : 'bg-azul'}"
          style={ctaHovered ? (isLight ? 'box-shadow: 0 0 50px #DE3B8490, 0 0 100px #D6007D40' : 'box-shadow: 0 0 50px #0070f390, 0 0 100px #0070f340') : ''}
          onmouseenter={onBtnEnter}
          onmouseleave={onBtnLeave}
        >
          <span class="invisible whitespace-nowrap">Contactar ahora →</span>
          <span bind:this={primaryRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(0%)">Contactar ahora →</span>
          <span bind:this={cloneRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(-110%)">Contactar ahora →</span>
        </a>

        <p class="mt-6 text-sm transition-colors duration-500 {isLight ? 'text-gray-400' : 'text-gray-500'}">
          <a href="/contacto" class="hover:underline">Formulario de contacto</a> · g.prado@externia.ai · +34 648 264 949
        </p>
      </FadeIn>
    </div>
  </section>
</div>
