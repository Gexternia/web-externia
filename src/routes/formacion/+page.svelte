<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import NetworkParticlesBg from '$lib/components/quienes-somos/NetworkParticlesBg.svelte';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';
  import SectionLabel from '$lib/components/shared/SectionLabel.svelte';
  import TiltCard from '$lib/components/shared/TiltCard.svelte';
  import MagneticRepel from '$lib/components/shared/MagneticRepel.svelte';

  let isLight = $state(false);
  let NetworkParticlesCmp = $state<typeof NetworkParticlesBg | null>(null);
  let expanded = $state<number | null>(null);

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

  const PROGRAMAS_DATA = [
    {
      num: '01',
      title: 'Taller Introductorio',
      intro: 'Para profesionales que quieren dar sus primeros pasos en la IA de forma práctica, sin tecnicismos y aplicada directamente a su día a día en eventos.',
      listTitle: '¿Qué aprenderás?',
      items: [
        'Qué es la IA y cómo funciona en la práctica: conceptos clave sin jerga técnica, orientados a la toma de decisiones.',
        'Las herramientas de IA más útiles para eventos: ChatGPT, Claude, Midjourney, Canva AI, Notion AI y otras soluciones aplicadas a la producción y comunicación de eventos.',
        'Prompting efectivo para eventos: cómo escribir instrucciones precisas para obtener resultados profesionales en briefings, propuestas, copies y creatividades.',
        'Automatización de tareas repetitivas: correos, informes, resúmenes de reuniones, cronogramas y documentación con IA.',
        'Casos de uso reales del sector: ejemplos concretos de cómo agencias y organizadores ya están usando la IA en España.',
      ],
      duracion: '4 horas (formato intensivo) o 2 sesiones de 2 horas',
      dirigido: 'Equipos de agencias, coordinadores de eventos, técnicos de comunicación',
      modalidad: 'Presencial, online o híbrida',
      extra: undefined as string | undefined,
    },
    {
      num: '02',
      title: 'Programa Avanzado',
      intro: 'Para profesionales que ya conocen las bases de la IA y quieren desarrollar una visión estratégica completa, integrando la inteligencia artificial en sus flujos de trabajo, propuestas y modelo de negocio.',
      listTitle: '¿Qué aprenderás?',
      items: [
        'Estrategia de IA para agencias de eventos: cómo posicionar la IA como ventaja competitiva frente a clientes y en procesos de licitación.',
        'Diseño de flujos de trabajo con IA: automatización de propuestas, briefings, seguimiento de clientes, gestión de proveedores y reporting.',
        'IA para la experiencia del asistente: herramientas y metodologías para diseñar activaciones, personalización y engagement con IA.',
        'Creación de contenido con IA: generación de imágenes, vídeos cortos, copies para RRSS, dossieres y presentaciones de forma ágil y profesional.',
        'Análisis de datos e informes de impacto: cómo usar IA para interpretar datos de asistentes, medir ROI y generar informes automatizados.',
        'Marco legal y ético: Ley de IA de la UE, protección de datos (RGPD), uso responsable de IA generativa y derechos de imagen.',
        'Herramientas avanzadas y agentes de IA: introducción a flujos de trabajo con agentes de IA, Make/Zapier con IA, GPTs personalizados para el sector.',
      ],
      duracion: '16 horas (4 sesiones de 4 horas) o formato intensivo de 2 días',
      dirigido: 'Directores de agencias, project managers, responsables de innovación',
      modalidad: 'Presencial, online o híbrida — con acceso a materiales y recursos tras la formación',
      extra: undefined as string | undefined,
    },
    {
      num: '03',
      title: 'Formación a Medida',
      intro: 'Diseñamos programas completamente personalizados para empresas, departamentos o equipos con necesidades específicas. Desde una sesión de sensibilización para directivos hasta un programa de certificación interna para un equipo completo.',
      listTitle: '¿Cómo funciona?',
      items: [
        'Diagnóstico inicial: analizamos el nivel actual del equipo, los objetivos de negocio y las herramientas que ya utilizan.',
        'Diseño del programa: creamos un itinerario formativo adaptado, con los módulos, la duración y el ritmo que mejor se ajustan al equipo.',
        'Impartición: presencial en las instalaciones del cliente, online o híbrida, con materiales y ejercicios prácticos del sector.',
        'Seguimiento: sesión de resolución de dudas post-formación y acceso a recursos complementarios durante 30 días.',
      ],
      duracion: 'Flexible — de 2 horas a varios días según las necesidades del cliente',
      dirigido: 'Empresas, departamentos de eventos, equipos de marketing y comunicación',
      modalidad: 'Adaptada al cliente — presencial, online o híbrida',
      extra: 'Hemos desarrollado programas a medida para agencias de comunicación y eventos, departamentos de marketing de IBEX 35 y equipos de producción que quieren integrar la IA en su operativa real sin interrumpir su flujo de trabajo habitual.',
    },
  ];

  const programasResumen = [
    { icon: '🌱', title: 'Taller Introductorio', level: 'Nivel básico', desc: 'Para equipos que quieren empezar a usar la IA de forma práctica y rápida. Resultados visibles desde la primera sesión.', gradient: 'from-[#DE3B84]/8 to-[#FFC12D]/4', hoverLight: 'hover:border-[#DE3B84]/50' },
    { icon: '🚀', title: 'Programa Avanzado', level: 'Nivel estratégico', desc: 'Para profesionales que buscan una visión completa: herramientas, flujos de trabajo, casos de uso y aplicación al negocio de eventos.', gradient: 'from-[#FFC12D]/8 to-[#F7A361]/4', hoverLight: 'hover:border-[#FFC12D]/50' },
    { icon: '🎯', title: 'Formación a Medida', level: 'Personalizado', desc: 'Programas específicos para agencias o departamentos, incluyendo formatos presenciales, online e híbridos.', gradient: 'from-[#F7A361]/8 to-[#EE847B]/4', hoverLight: 'hover:border-[#F7A361]/50' },
  ];

  const publicos = [
    { label: 'Agencias de eventos y comunicación', desc: 'que quieren incorporar la IA en sus propuestas, operativa y diferenciación frente a la competencia.' },
    { label: 'Departamentos de marketing y eventos de empresa', desc: 'que organizan eventos internos, lanzamientos de producto o convenciones y quieren hacerlo con más eficiencia e impacto.' },
    { label: 'Profesionales independientes del sector', desc: 'coordinadores freelance, consultores y técnicos de eventos que quieren actualizar sus competencias y ser más competitivos.' },
    { label: 'Equipos de ventas de espacios y venues', desc: 'que necesitan entender la IA para responder mejor a las demandas de sus clientes organizadores.' },
  ];

  const diferenciasItems = [
    { icon: '🎯', title: '100% aplicada al sector MICE y eventos', desc: 'No enseñamos IA genérica. Cada ejemplo, herramienta y ejercicio está pensado para la realidad de un profesional de eventos.' },
    { icon: '👤', title: 'Formador con credencial científica y experiencia de sector', desc: 'Una combinación que no encontrarás en ninguna otra formación del mercado español.' },
    { icon: '⚡', title: 'Práctica desde el primer minuto', desc: 'Nada de diapositivas interminables: trabajamos con herramientas reales y casos aplicables desde el mismo día.' },
    { icon: '🔄', title: 'Actualización continua', desc: 'El mundo de la IA cambia cada semana. Nuestros programas se actualizan constantemente para incluir las herramientas y tendencias más relevantes.' },
    { icon: '⚖️', title: 'Cumplimiento legal integrado', desc: 'Abordamos el uso ético y legal de la IA desde el inicio, incluyendo la Ley de IA de la UE y el RGPD aplicado al sector.' },
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
  <title>Formación — Externia AI for Events</title>
  <meta name="description" content="Formaciones en IA para eventos. Programas y talleres." />
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
      <SectionLabel text="Formación" {isLight} />
    </FadeIn>
    <FadeIn delay={0.2}>
      <h1 class="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight max-w-4xl transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
        Formaciones en <span class="gradient-text-animate">IA</span> para Eventos
      </h1>
    </FadeIn>
    <FadeIn delay={0.4}>
      <p class="relative z-10 mt-6 text-lg sm:text-xl max-w-2xl leading-relaxed transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-300'}">
        Aprende IA aplicada al sector que conoces.
      </p>
    </FadeIn>
    <FadeIn delay={0.55}>
      <p class="relative z-10 mt-3 text-sm uppercase tracking-widest font-semibold transition-colors duration-500 {isLight ? 'text-brand-magenta/80' : 'text-azul/90'}">
        Presencial · Online · A medida
      </p>
    </FadeIn>
  </section>

  <!-- Formación Especializada -->
  <section class="section-divider relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-16">
        <SectionLabel text="Formación Especializada" {isLight} />
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          IA aplicada al <span class="gradient-text-animate">sector MICE</span>
        </h2>
        <p class="mt-4 text-base max-w-xl mx-auto transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          No enseñamos IA genérica. Enseñamos IA aplicada a las necesidades de quienes organizan, producen y venden eventos.
        </p>
      </FadeIn>

      <div class="grid md:grid-cols-3 gap-6">
        {#each programasResumen as p, i}
          <MagneticRepel strength={13} radius={175}>
            <FadeIn delay={i * 0.12}>
              <div class="h-full p-7 rounded-2xl border transition-all duration-300 cursor-default {isLight ? `shadow-card-light shadow-card-light-hover bg-gradient-to-br ${p.gradient} bg-white/90 border-gray-100 ${p.hoverLight} backdrop-blur-sm` : 'bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/45 hover:bg-[#00c8ff]/6 backdrop-blur-sm'}">
                <div class="text-4xl mb-5">{p.icon}</div>
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

  <!-- ¿Por qué formarse? -->
  <section class="section-divider relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="max-w-4xl mx-auto relative z-10">
      <FadeIn className="text-center mb-16">
        <SectionLabel text="¿Por qué formarse con Externia?" {isLight} />
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black leading-tight transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          IA que entiende tu <span class="gradient-text-animate">sector</span>
        </h2>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p class="text-base sm:text-lg leading-relaxed max-w-3xl {isLight ? 'text-gray-600' : 'text-gray-300'}">
          La inteligencia artificial ya está redefiniendo la industria de los eventos. Sin embargo, la mayoría de la formación en IA disponible es genérica, orientada a desarrolladores o desconectada de la realidad del sector MICE.
        </p>
      </FadeIn>
      <FadeIn delay={0.15}>
        <p class="mt-5 text-base sm:text-lg leading-relaxed max-w-3xl {isLight ? 'text-gray-600' : 'text-gray-300'}">
          En Externia lo hacemos diferente: enseñamos IA aplicada exactamente al trabajo de quienes organizan, producen, venden y diseñan eventos.
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p class="mt-6 text-base sm:text-lg leading-relaxed max-w-3xl {isLight ? 'text-gray-600' : 'text-gray-300'}">
          Nuestros programas están diseñados y liderados por el <strong class={isLight ? 'text-gray-900' : 'text-white'}>Dr. Guillermo Prado Vázquez</strong> — investigador en IA, especialista en eventos y finalista del Innovation Champion en los MPI Iberian Awards 2025 — con una visión única: la de alguien que domina la tecnología y vive el sector desde dentro.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <blockquote class="relative mt-12 px-6 sm:px-8 py-8 sm:py-10 rounded-2xl overflow-hidden {isLight ? 'bg-gradient-to-br from-brand-magenta/8 via-white to-brand-fuchsia/6 border border-brand-magenta/15' : 'bg-gradient-to-br from-azul/12 via-[#0d1829] to-blue-500/8 border border-azul/20'}">
          <span class="absolute top-5 left-6 text-5xl sm:text-6xl font-serif leading-none select-none {isLight ? 'text-brand-magenta/15' : 'text-azul/20'}" aria-hidden="true">"</span>
          <div class="relative">
            <p class="text-base sm:text-lg font-semibold tracking-tight m-0 mb-3 {isLight ? 'text-gray-600' : 'text-gray-400'}">No enseñamos herramientas.</p>
            <p class="text-xl sm:text-2xl md:text-3xl font-black leading-tight m-0 gradient-text-animate">Enseñamos a pensar con IA.</p>
          </div>
        </blockquote>
      </FadeIn>
    </div>
  </section>

  <!-- Programas -->
  <section class="section-divider relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-12">
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Tres niveles, un mismo <span class="gradient-text-animate">objetivo</span>
        </h2>
        <p class="mt-4 text-base max-w-2xl mx-auto transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Haz clic en un programa para ver el detalle.
        </p>
      </FadeIn>

      <FadeIn className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {#each PROGRAMAS_DATA as p, i}
          <button
            type="button"
            onclick={() => (expanded = expanded === i ? null : i)}
            class="rounded-2xl border p-5 sm:p-6 text-left transition-colors duration-300 flex items-center gap-4 w-full {expanded === i ? (isLight ? 'bg-brand-magenta/10 border-brand-magenta/50 shadow-card-light shadow-card-light-hover ring-2 ring-brand-magenta/20' : 'bg-azul/10 border-azul/50 shadow-lg ring-2 ring-azul/20') : (isLight ? 'shadow-card-light shadow-card-light-hover bg-white/90 border-gray-100 hover:border-brand-magenta/30' : 'bg-[#0d1829]/90 border-white/8 hover:border-azul/40')}"
          >
            <span class="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white {isLight ? 'bg-brand-magenta' : 'bg-azul'}">{p.num}</span>
            <span class="font-bold text-base sm:text-lg truncate {isLight ? 'text-gray-900' : 'text-white'}">{p.title}</span>
            <span class="shrink-0 ml-auto transition-transform duration-300 {expanded === i ? 'rotate-180' : ''}" aria-hidden="true">▼</span>
          </button>
        {/each}
      </FadeIn>

      {#if expanded !== null}
        {#key expanded}
          <div
            in:slide
            out:slide
            class="overflow-hidden"
          >
            {#each PROGRAMAS_DATA.filter((_, idx) => idx === expanded) as p}
              <div class="rounded-2xl border overflow-hidden {isLight ? 'shadow-card-light shadow-card-light-hover bg-white/90 border-gray-100 backdrop-blur-sm border-brand-magenta/20' : 'bg-[#0d1829]/90 border-white/8 backdrop-blur-sm border-azul/30'}">
                <div class="h-1 w-full {isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia' : 'bg-gradient-to-r from-azul to-blue-400'}"></div>
                <div class="p-8 sm:p-10">
                  <div class="flex flex-col md:flex-row md:items-start gap-8">
                    <div class="shrink-0">
                      <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg {isLight ? 'bg-brand-magenta' : 'bg-azul'}">{p.num}</div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-2xl sm:text-3xl font-black mb-2 {isLight ? 'text-gray-900' : 'text-white'}">{p.title}</h3>
                      <p class="text-base sm:text-lg leading-relaxed mb-8 text-balance {isLight ? 'text-gray-600' : 'text-gray-300'}">{p.intro}</p>

                      <div class="rounded-xl p-5 mb-6 {isLight ? 'bg-gray-50/80' : 'bg-white/5'}">
                        <p class="text-sm font-bold mb-4 flex items-center gap-2 {isLight ? 'text-brand-magenta' : 'text-azul'}">
                          <span aria-hidden="true">✓</span> {p.listTitle}
                        </p>
                        <ul class="space-y-3 text-sm sm:text-base leading-relaxed {isLight ? 'text-gray-600' : 'text-gray-400'}">
                          {#each p.items as item}
                            <li class="flex gap-3">
                              <span class="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full {isLight ? 'bg-brand-magenta' : 'bg-azul'}" aria-hidden="true"></span>
                              <span>{item}</span>
                            </li>
                          {/each}
                        </ul>
                      </div>

                      {#if p.extra}
                        <p class="text-sm leading-relaxed mb-6 pl-4 border-l-2 {isLight ? 'border-brand-magenta/40 text-gray-500' : 'border-azul/40 text-gray-400'}">{p.extra}</p>
                      {/if}

                      <div class="grid sm:grid-cols-3 gap-6 pt-6 border-t {isLight ? 'border-gray-200' : 'border-white/10'}">
                        <div class="flex gap-3">
                          <span class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg {isLight ? 'bg-brand-magenta/10 text-brand-magenta' : 'bg-azul/15 text-azul'}" aria-hidden="true">⏱</span>
                          <div>
                            <span class="text-xs font-bold tracking-widest uppercase block mb-0.5 {isLight ? 'text-brand-magenta' : 'text-azul'}">Duración</span>
                            <p class="text-sm leading-snug {isLight ? 'text-gray-700' : 'text-gray-300'}">{p.duracion}</p>
                          </div>
                        </div>
                        <div class="flex gap-3">
                          <span class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg {isLight ? 'bg-brand-magenta/10 text-brand-magenta' : 'bg-azul/15 text-azul'}" aria-hidden="true">👥</span>
                          <div>
                            <span class="text-xs font-bold tracking-widest uppercase block mb-0.5 {isLight ? 'text-brand-magenta' : 'text-azul'}">Dirigido a</span>
                            <p class="text-sm leading-snug {isLight ? 'text-gray-700' : 'text-gray-300'}">{p.dirigido}</p>
                          </div>
                        </div>
                        <div class="flex gap-3">
                          <span class="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg {isLight ? 'bg-brand-magenta/10 text-brand-magenta' : 'bg-azul/15 text-azul'}" aria-hidden="true">📍</span>
                          <div>
                            <span class="text-xs font-bold tracking-widest uppercase block mb-0.5 {isLight ? 'text-brand-magenta' : 'text-azul'}">Modalidad</span>
                            <p class="text-sm leading-snug {isLight ? 'text-gray-700' : 'text-gray-300'}">{p.modalidad}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/key}
      {/if}
    </div>
  </section>

  <!-- ¿Para quién? -->
  <section class="section-divider relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="max-w-4xl mx-auto relative z-10">
      <FadeIn className="text-center mb-12">
        <SectionLabel text="¿Para quién son estas formaciones?" {isLight} />
        <h2 class="text-3xl sm:text-4xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Dirigido a quienes quieren <span class="gradient-text-animate">liderar con IA</span>
        </h2>
      </FadeIn>

      <div class="grid sm:grid-cols-2 gap-5 items-stretch">
        {#each publicos as item, i}
          <MagneticRepel strength={12} radius={150} className="h-full min-h-0">
            <FadeIn delay={i * 0.08} className="h-full">
              <div class="flex gap-4 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 h-full {isLight ? 'shadow-card-light shadow-card-light-hover bg-white/90 border-gray-100 hover:border-brand-magenta/20' : 'bg-[#0d1829]/80 border-white/5 hover:border-azul/30'}">
                <span class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg self-start {isLight ? 'bg-brand-magenta/10 text-brand-magenta' : 'bg-azul/15 text-azul'}" aria-hidden="true">👤</span>
                <div class="min-w-0 flex flex-col flex-1">
                  <p class="font-bold text-base mb-1 {isLight ? 'text-gray-900' : 'text-white'}">{item.label}</p>
                  <p class="text-sm sm:text-base leading-relaxed flex-1 {isLight ? 'text-gray-600' : 'text-gray-400'}">{item.desc}</p>
                </div>
              </div>
            </FadeIn>
          </MagneticRepel>
        {/each}
      </div>
    </div>
  </section>

  <!-- Diferencias -->
  <section class="section-divider relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-16">
        <SectionLabel text="Lo que hace diferente nuestra formación" {isLight} />
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Cinco razones para elegir <span class="gradient-text-animate">Externia</span>
        </h2>
      </FadeIn>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {#each diferenciasItems as item, i}
          <MagneticRepel strength={13} radius={160} className="h-full min-h-0">
            <FadeIn delay={i * 0.08} className="h-full">
              <TiltCard className="rounded-2xl border overflow-hidden transition-all duration-300 h-full flex flex-col {isLight ? 'shadow-card-light shadow-card-light-hover bg-white/90 border-gray-100 hover:border-brand-magenta/30 backdrop-blur-sm' : 'bg-[#0d1829]/80 border-white/5 hover:border-azul/40 backdrop-blur-sm'}">
                <div class="w-full h-1 flex-shrink-0 {isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia' : 'bg-gradient-to-r from-azul to-blue-400'}"></div>
                <div class="p-6 flex-1 flex flex-col">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 {isLight ? 'bg-brand-magenta/10' : 'bg-azul/15'}">{item.icon}</div>
                  <h3 class="text-lg font-bold mb-2 {isLight ? 'text-gray-900' : 'text-white'}">{item.title}</h3>
                  <p class="text-sm leading-relaxed flex-1 {isLight ? 'text-gray-600' : 'text-gray-400'}">{item.desc}</p>
                </div>
              </TiltCard>
            </FadeIn>
          </MagneticRepel>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="relative py-32 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-12 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-magenta' : 'bg-azul'}"></div>

    <div class="max-w-3xl mx-auto text-center relative z-10">
      <FadeIn>
        <SectionLabel text="¿Listo para formarte?" {isLight} />
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Da el siguiente paso con <span class="gradient-text-animate">IA aplicada a eventos</span>
        </h2>
        <p class="text-lg mb-10 max-w-xl mx-auto transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Elige el programa que mejor se adapte a tu equipo y contacta con nosotros. Te respondemos sin compromiso.
        </p>

        <a
          href="/contacto"
          class="btn-cta-animated micro-active-press relative inline-block overflow-hidden px-12 py-5 rounded-full text-lg font-bold text-white transition-all duration-300 hover:scale-105 {isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia' : 'bg-azul'}"
          style={ctaHovered ? (isLight ? 'box-shadow: 0 0 50px #DE3B8490, 0 0 100px #D6007D40' : 'box-shadow: 0 0 50px #0070f390, 0 0 100px #0070f340') : ''}
          onmouseenter={onBtnEnter}
          onmouseleave={onBtnLeave}
        >
          <span class="invisible whitespace-nowrap">Contactar →</span>
          <span bind:this={primaryRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(0%)">Contactar →</span>
          <span bind:this={cloneRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(-110%)">Contactar →</span>
        </a>
      </FadeIn>
    </div>
  </section>
</div>
