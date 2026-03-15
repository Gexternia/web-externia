<script lang="ts">
  import { onMount } from 'svelte';
  import NetworkParticlesBg from '$lib/components/quienes-somos/NetworkParticlesBg.svelte';
  import WheelCarousel from '$lib/components/servicios/WheelCarousel.svelte';
  import SlideButton from '$lib/components/servicios/SlideButton.svelte';
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

  const ACTIVATION_CARDS = [
    { emoji: '🖌️', category: 'Transformación Creativa', title: 'Smart Brush', desc: 'El asistente dibuja sobre una tableta y la IA transforma su trazo en una creación artística de alta calidad en tiempo real.', ideal: 'Stands en ferias, networking corporativo, lanzamientos de producto', gradientLight: 'from-[#DE3B84] via-[#D6007D] to-[#a8005f]', gradientDark: 'from-[#0070f3] via-[#0050c8] to-[#003a99]' },
    { emoji: '🎮', category: 'Experiencia Gamificada', title: 'RetroGame', desc: 'Aplicación en tótem digital que convierte a la persona y su negocio en un videojuego. Genera portada descargable e imprimible y personajes jugables. Efecto WOW y recuerdo duradero.', ideal: 'Eventos empresariales, ferias PYME, teambuilding', gradientLight: 'from-[#9B5CF8] via-[#7C3AED] to-[#5B21B6]', gradientDark: 'from-[#6366f1] via-[#4f46e5] to-[#4338ca]', image: '/activaciones/retrogame.png', link: 'https://tu-pyme-el-videojuego-de-los-90-46874276291.us-west1.run.app/' },
    { emoji: '📖', category: 'Storytelling Visual', title: 'ComicGen', desc: 'Genera historias estilo novela gráfica en base a la persona y su PYME. El asistente es el protagonista de su propia historia heroica. Formato digital o impreso en mini revista.', ideal: 'Eventos corporativos, lanzamientos, ferias', gradientLight: 'from-[#F59E0B] via-[#D97706] to-[#B45309]', gradientDark: 'from-[#f97316] via-[#ea580c] to-[#c2410c]', image: '/activaciones/comicgen.png', link: 'https://comicgen-totem-46874276291.us-west1.run.app/' },
    { emoji: '💳', category: 'Networking Digital', title: 'NeoCard', desc: 'Genera tarjetas de visita con IA. Los asistentes rellenan datos por voz o texto. Se imprime al momento con código QR vCard para enviar contactos al instante.', ideal: 'Networking, ferias, congresos, eventos B2B', gradientLight: 'from-[#0EA5E9] via-[#0284C7] to-[#0369A1]', gradientDark: 'from-[#06b6d4] via-[#0891b2] to-[#0e7490]', image: '/activaciones/neocard.png', link: 'https://generador-tarjetas.onrender.com/' },
    { emoji: '🎨', category: 'Personalización Visual', title: 'FXstylized', desc: 'Convierte el rostro del invitado en objetos personalizados: blíster de juguetes, tazas, latas, pósters, llaveros. Imágenes compartibles al instante en redes para potenciar la viralidad.', ideal: 'Activaciones de marca, merchandising único, recuerdos personalizados', gradientLight: 'from-[#EC4899] via-[#DB2777] to-[#BE185D]', gradientDark: 'from-[#f472b6] via-[#ec4899] to-[#db2777]', image: '/activaciones/fxstylized.png' },
    { emoji: '✨', category: 'Fotocall con IA', title: 'Profesi-O-Matic', desc: 'Fotocall con IA que convierte a los asistentes en sus profesiones soñadas. Eligen atrezzo, se fotografían y la IA genera una imagen de su "yo profesional". Descarga y comparte.', ideal: 'Ferias, eventos corporativos, teambuilding, activaciones virales', gradientLight: 'from-[#10B981] via-[#059669] to-[#047857]', gradientDark: 'from-[#34d399] via-[#10b981] to-[#059669]', image: '/activaciones/profesi-o-matic.png', link: 'https://profesi-o-matic-46874276291.us-west1.run.app/' },
    { emoji: '🔮', category: 'Entretenimiento Personalizado', title: 'Mystic Oracle', desc: "Pitonisa virtual que 'predice' el futuro profesional del asistente de manera divertida e interactiva. Interacción por voz y consejos con humor.", ideal: 'Activaciones de marca, eventos temáticos, inauguraciones, cenas de gala', gradientLight: 'from-[#EE847B] via-[#DE3B84] to-[#b02060]', gradientDark: 'from-[#2860c0] via-[#1850a8] to-[#083890]', image: '/activaciones/mystic-oracle.png', link: 'https://madame-gemini-pitonisa-virtual-46874276291.us-west1.run.app/' },
    { emoji: '😄', category: 'Entretenimiento Personalizado', title: 'Carizaturízame', desc: 'La IA redefine el arte de la caricatura: genera retratos humorísticos e hiperpersonalizados. Más de 2.300 caricaturas en un solo evento.', ideal: 'Ferias, eventos masivos, stands con alto tráfico de visitantes', gradientLight: 'from-[#DE3B84] via-[#EE847B] to-[#F7A361]', gradientDark: 'from-[#0070f3] via-[#1a60d0] to-[#3050b0]' },
  ];

  const paraQuienTypes = [
    { icon: '🏷️', title: 'Activaciones de marca', desc: 'Donde el objetivo es generar efecto WOW y conexión emocional entre los asistentes y la marca.' },
    { icon: '🏢', title: 'Eventos corporativos', desc: 'Para enriquecer momentos de networking, entretener en cenas de gala y crear oportunidades de patrocinio únicas.' },
    { icon: '🎪', title: 'Ferias y congresos', desc: 'Para atraer un alto volumen de visitantes, captar su atención y dejar una impresión duradera.' },
    { icon: '🤝', title: 'Teambuilding e incentivos', desc: 'Activaciones lúdicas que refuerzan la cohesión de equipo y generan recuerdos compartidos.' },
  ];

  const categories = [
    { icon: '🖌️', label: 'Transformación Creativa', count: 1 },
    { icon: '🎮', label: 'Experiencias interactivas', count: 5 },
    { icon: '🎭', label: 'Entretenimiento Personalizado', count: 2 },
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
  <title>Activaciones — Externia AI for Events</title>
  <meta name="description" content="Activaciones de IA para eventos. Experiencias interactivas, consultoría y formación." />
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
      <SectionLabel text="Nuestras Activaciones" {isLight} />
    </FadeIn>

    <FadeIn delay={0.2}>
      <h1 class="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight max-w-5xl transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
        Experiencias de <span class="gradient-text-animate">IA</span><br />que impactan
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
      <SlideButton href="/consultoria" label="Consultoría" icon="🧠" {isLight} />
      <SlideButton href="/formacion" label="Formación" icon="📚" {isLight} />
    </FadeIn>
  </section>

  <!-- Activaciones -->
  <section id="activaciones" class="section-divider relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-20">
        <SectionLabel text="01 · Activaciones de IA Experiencial" {isLight} />
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Experiencias que <span class="gradient-text-animate">Sorprenden</span>
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
          <div class="flex items-center gap-3 px-5 py-3 rounded-2xl border transition-colors duration-500 {isLight ? 'shadow-card-light bg-white/80 border-gray-100' : 'bg-[#0d1829]/80 border-white/8'}">
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

  <!-- Para quién -->
  <section class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {isLight ? 'bg-gradient-to-br from-[#f0a0c0] via-[#dc80c8] to-[#f8c090]' : 'bg-[#060d1a]/95 backdrop-blur-sm'}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-16">
        <SectionLabel text="¿Para qué eventos?" {isLight} white={isLight} />
        <h2 class="text-4xl sm:text-5xl font-black text-white">
          Diseñados para el <span class="gradient-text-animate">impacto real</span>
        </h2>
      </FadeIn>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {#each paraQuienTypes as t, i}
          <FadeIn delay={i * 0.1}>
            <MagneticRepel strength={12} radius={155}>
              <div class="p-6 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 {isLight ? 'bg-white/15 border-white/25 backdrop-blur-sm hover:bg-white/25' : 'bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/40 backdrop-blur-sm'}">
                <div class="text-4xl mb-4">{t.icon}</div>
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
          Tu próxima experiencia <span class="gradient-text-animate">inolvidable</span>
        </h2>
        <p class="text-lg mb-10 transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Cuéntanos tu evento y te proponemos la solución MAPI perfecta para él.
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

        <p class="mt-6 text-sm transition-colors duration-500 {isLight ? 'text-gray-400' : 'text-gray-500'}">
          <a href="/contacto" class="hover:underline">Formulario de contacto</a> · g.prado@externia.ai · +34 648 264 949
        </p>
      </FadeIn>
    </div>
  </section>
</div>
