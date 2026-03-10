<script lang="ts">
  import { onMount } from 'svelte';
  import FlipCard from '$lib/components/quienes-somos/FlipCard.svelte';
  import ManifiestoWords from '$lib/components/quienes-somos/ManifiestoWords.svelte';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';
  import SectionLabel from '$lib/components/shared/SectionLabel.svelte';
  import TiltCard from '$lib/components/shared/TiltCard.svelte';
  import MagneticRepel from '$lib/components/shared/MagneticRepel.svelte';
  import MagneticAttract from '$lib/components/shared/MagneticAttract.svelte';
  import Counter from '$lib/components/shared/Counter.svelte';

  let isLight = $state(false);
  let NetworkParticlesBg = $state<typeof import('$lib/components/quienes-somos/NetworkParticlesBg.svelte').default | null>(null);

  onMount(() => {
    isLight = document.documentElement.classList.contains('light');
    const handler = () => {
      isLight = document.documentElement.classList.contains('light');
    };
    window.addEventListener('themechange', handler);
    import('$lib/components/quienes-somos/NetworkParticlesBg.svelte').then((mod) => {
      NetworkParticlesBg = mod.default;
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

  const phrase1 = ['No', 'somos', 'una', 'empresa', 'de', 'tecnología', 'que', 'hace', 'eventos.'];
  const phrase2 = ['Somos', 'especialistas', 'en', 'eventos', 'que', 'dominan', 'la', 'IA.'];
  const manifestWords = [...phrase1, ...phrase2];
  const manifestHighlight = new Set(['especialistas', 'dominan', 'IA.']);

  const timeline = [
    { year: '2022', icon: '🔬', text: 'Guillermo descubre el potencial de los modelos generativos mientras investiga IA en oncología en el Hospital La Paz.' },
    { year: '2023', icon: '🌍', text: 'Aprende el sector de los eventos desde dentro en Externa Marketing & Events y participa en el Mobile World Congress de Barcelona.' },
    { year: '2024', icon: '🚀', text: 'Funda Externia. En menos de 2 meses ya colabora con 5 de las principales agencias de eventos de España y proyectos para clientes del IBEX 35.' },
    { year: '2025', icon: '🏆', text: 'Ganador del premio Event Industry Entrepreneur y finalista del Innovation Champion en los MPI Iberian Awards — Valencia.' },
  ];

  let activeTimelineIdx = $state<number | null>(null);

  const features = [
    { icon: '🎯', title: 'Especialización exclusiva MICE', desc: 'Entendemos los ritmos, necesidades y lenguaje de los eventos mejor que nadie.', lightGrad: 'from-[#DE3B84]/8 to-[#D6007D]/4', hoverLight: 'hover:border-[#DE3B84]/50' },
    { icon: '✨', title: 'Tecnología que no se nota', desc: 'Activaciones discretas, fluidas, que generan momentos WOW de forma completamente natural.', lightGrad: 'from-[#FFC12D]/8 to-[#F7A361]/4', hoverLight: 'hover:border-[#FFC12D]/50' },
    { icon: '❤️', title: 'Enfoque en el asistente', desc: 'Experiencias hiperpersonalizadas que crean conexión emocional real entre la marca y las personas.', lightGrad: 'from-[#EE847B]/8 to-[#DE3B84]/4', hoverLight: 'hover:border-[#EE847B]/50' },
    { icon: '🌱', title: 'Compromiso sostenible', desc: 'Colaboramos con el Sustainability Hub for Events y trabajamos para soluciones neutras en carbono.', lightGrad: 'from-[#D6007D]/8 to-[#EE847B]/4', hoverLight: 'hover:border-[#D6007D]/50' },
    { icon: '⚖️', title: 'Cumplimiento regulatorio', desc: 'Operamos en plena conformidad con la Ley de IA de la UE y los más altos estándares de protección de datos.', lightGrad: 'from-[#F7A361]/8 to-[#FFC12D]/4', hoverLight: 'hover:border-[#F7A361]/50' },
    { icon: '📊', title: 'Resultados medibles', desc: 'Cada activación genera informes de impacto detallados. La IA no solo impresiona, también demuestra su valor con datos reales.', lightGrad: 'from-[#DE3B84]/8 to-[#FFC12D]/4', hoverLight: 'hover:border-[#DE3B84]/50' },
  ];

  const services = [
    { icon: '🧠', title: 'Consultoría de IA para Eventos', desc: 'Acompañamos a agencias y empresas en la integración estratégica de la IA. Identificamos oportunidades, diseñamos hojas de ruta y formamos equipos para que la IA sea una ventaja real.', gradient: 'from-[#DE3B84] to-[#D6007D]' },
    { icon: '⚡', title: 'Activaciones Hiperpersonalizadas', desc: 'Smart Brush (caricaturas IA), transformaciones de avatar, oracle experiences, matchmaking inteligente, tarjetas de visita con IA, photocalls interactivos y mucho más.', gradient: 'from-[#FFC12D] to-[#F7A361]' },
    { icon: '📚', title: 'Formación Especializada', desc: 'Programas adaptados al sector: desde talleres introductorios hasta certificaciones avanzadas. Preparamos a los profesionales para el presente y el futuro.', gradient: 'from-[#EE847B] to-[#DE3B84]' },
  ];

  const metodologiaSteps = [
    { num: '01', title: 'CRE-IA-tividad', desc: 'Exploramos el contexto del evento, los objetivos y el perfil de los asistentes para co-crear la solución más adecuada con brainstorming aumentado con IA.', colorLight: '#DE3B84', colorDark: '#0070f3' },
    { num: '02', title: 'AI-mplementación', desc: 'Desarrollamos e integramos la solución de forma ágil y eficiente, asegurando que la tecnología se adapte al espacio, el tiempo y el equipo humano.', colorLight: '#FFC12D', colorDark: '#3b82f6' },
    { num: '03', title: 'Evolución y Optimización', desc: 'Monitorizamos resultados en tiempo real, recogemos feedback y generamos informes de impacto medibles para cada cliente.', colorLight: '#F7A361', colorDark: '#60a5fa' },
  ];

  const stats = [
    { value: 2300, suffix: '+', label: 'caricaturas generadas por IA en un solo evento', color: '#DE3B84' },
    { value: 600, suffix: '+', label: 'asignaciones de asientos automatizadas', color: '#FFC12D' },
    { value: 4800, suffix: '+', label: 'conexiones inteligentes de matchmaking', color: '#F7A361' },
    { value: 1200, suffix: '+', label: 'registros gestionados con lenguaje natural', color: '#EE847B' },
    { value: 5, suffix: '', label: 'grandes agencias españolas en los primeros 2 meses', color: '#D6007D' },
  ];

  let replays = $state([0, 0, 0, 0, 0]);
  function handleStatClick(i: number) {
    replays = replays.map((v, j) => (j === i ? v + 1 : v));
  }

  const valueCards = [
    { icon: '🔬', label: 'Rigor analítico' },
    { icon: '💡', label: 'Creatividad disruptiva' },
    { icon: '🤝', label: 'Respeto por las personas' },
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
  <title>Quiénes Somos — Externia AI for Events</title>
  <meta name="description" content="Externia es la primera consultora española especializada al 100% en inteligencia artificial aplicada al sector MICE." />
</svelte:head>

{#if NetworkParticlesBg}
  <NetworkParticlesBg {isLight} />
{/if}

<div class="relative z-10 transition-colors duration-500">
  <!-- Hero -->
  <section class="relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-4 text-center transition-colors duration-500 {sectionBg(isLight)}">
    <div class="absolute top-1/4 -left-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-magenta' : 'bg-azul'}"></div>
    <div class="absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-yellow' : 'bg-blue-900'}"></div>

    <FadeIn delay={0.1}>
      <h1 class="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight max-w-5xl transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
        Camb<span class={isLight ? 'bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-brand-orange bg-clip-text text-transparent' : 'bg-gradient-to-r from-[#0070f3] via-blue-300 to-[#0070f3] bg-clip-text text-transparent'}>IA</span> el mundo.<br />
        Camb<span class={isLight ? 'bg-gradient-to-r from-brand-fuchsia via-brand-magenta to-brand-yellow bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-300 via-[#0070f3] to-blue-400 bg-clip-text text-transparent'}>IA</span> tu evento.
      </h1>
    </FadeIn>
    <FadeIn delay={0.35}>
      <p class="relative z-10 mt-6 text-lg sm:text-xl max-w-2xl leading-relaxed transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-300'}">
        La primera consultora española especializada al 100% en inteligencia artificial
        aplicada al sector MICE. Nacimos en 2024 para transformar la industria de los
        eventos desde el conocimiento profundo del sector.
      </p>
    </FadeIn>
  </section>

  <!-- Manifiesto -->
  <section class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {isLight ? 'bg-gradient-to-br from-[#f0a0c0] via-[#dc80c8] to-[#f8c090]' : 'bg-[#060d1a]/95 backdrop-blur-sm'}">
    <div class="max-w-5xl mx-auto text-center relative z-10">
      <ManifiestoWords words={manifestWords} highlight={manifestHighlight} {isLight} phrase2Start={9} />
    </div>
  </section>

  <!-- Historia -->
  <section class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="mb-16">
        <SectionLabel text="Nuestra Historia" {isLight} />
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black leading-tight transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          De la ciencia oncológica<br />
          <span class={isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia bg-clip-text text-transparent' : 'bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent'}>a revolucionar los eventos</span>
        </h2>
      </FadeIn>

      <div class="grid lg:grid-cols-2 gap-20 items-start">
        <div>
          {#each timeline as item, i}
            <FadeIn delay={i * 0.12} from="left">
              <div
                role="button"
                tabindex="0"
                class="flex gap-5 mb-2 rounded-2xl p-4 cursor-pointer transition-all duration-300 {activeTimelineIdx === i ? (isLight ? 'bg-brand-magenta/8' : 'bg-azul/8') : 'bg-transparent'}"
                onmouseenter={() => (activeTimelineIdx = i)}
                onmouseleave={() => (activeTimelineIdx = null)}
                onkeydown={(e) => e.key === 'Enter' && (activeTimelineIdx = activeTimelineIdx === i ? null : i)}
              >
                <div class="flex flex-col items-center shrink-0">
                  <div
                    class="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white transition-all duration-250 {isLight ? 'bg-brand-magenta' : 'bg-azul'}"
                    style="transform: scale({activeTimelineIdx === i ? 1.15 : 1}); box-shadow: {activeTimelineIdx === i ? (isLight ? '0 0 18px #DE3B8470' : '0 0 18px #0070f370') : '0 0 0 transparent'}"
                  >
                    {item.icon}
                  </div>
                  {#if i < timeline.length - 1}
                    <div class="w-px mt-2 {isLight ? 'bg-brand-magenta/25' : 'bg-azul/25'}" style="height: {activeTimelineIdx === i ? 56 : 48}px"></div>
                  {/if}
                </div>
                <div class="pb-4 pt-1">
                  <span class="text-xs font-extrabold tracking-widest uppercase {isLight ? 'text-brand-magenta' : 'text-azul'}">{item.year}</span>
                  <p class="mt-1.5 text-base leading-relaxed transition-colors duration-500 {isLight ? 'text-gray-700' : 'text-gray-300'}" style="opacity: {activeTimelineIdx === i ? 1 : 0.75}">
                    {item.text}
                  </p>
                </div>
              </div>
            </FadeIn>
          {/each}
        </div>

        <div class="flex flex-col gap-6">
          <FadeIn delay={0.2} from="right">
            <div class="relative">
              <div class="absolute -inset-3 rounded-3xl blur-2xl opacity-25 pointer-events-none {isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-yellow' : 'bg-azul'}"></div>
              <TiltCard className="block">
                <div class="relative rounded-2xl overflow-hidden border {isLight ? 'border-brand-magenta/15' : 'border-white/8'}">
                  <img src="/team/guillermo-premio.png" alt="Guillermo Prado — MPI Iberian Awards 2025" class="w-full h-[380px] object-cover object-top block" />
                  <div class="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md border {isLight ? 'bg-white/85 border-brand-magenta/15' : 'bg-black/75 border-white/10'}">
                    <p class="text-xs font-bold tracking-widest uppercase {isLight ? 'text-brand-magenta' : 'text-azul'}">🏆 MPI Iberian Awards 2025</p>
                    <p class="text-sm font-semibold mt-0.5 {isLight ? 'text-gray-900' : 'text-white'}">🥇 Ganador · Event Industry Entrepreneur</p>
                    <p class="text-xs mt-0.5 {isLight ? 'text-gray-500' : 'text-gray-400'}">Guillermo Prado Vázquez · Fundador Externia</p>
                  </div>
                </div>
              </TiltCard>
            </div>
          </FadeIn>

          <FadeIn delay={0.35} from="right">
            <blockquote class="p-6 rounded-2xl border italic {isLight ? 'bg-gradient-to-br from-[#fff5f9] to-[#fff8ee] border-brand-magenta/10' : 'bg-[#0d1829]/80 border-white/5 backdrop-blur-sm'}">
              <p class="text-base leading-relaxed font-medium {isLight ? 'text-gray-800' : 'text-gray-200'}">
                "La IA nos permite hacer los eventos más humanos, no menos.
                Cada activación está diseñada para crear conexión real entre la marca y las personas."
              </p>
              <footer class="mt-3 text-sm font-bold not-italic {isLight ? 'text-brand-magenta' : 'text-azul'}">
                — Guillermo Prado Vázquez, Fundador de Externia
              </footer>
            </blockquote>
          </FadeIn>
        </div>
      </div>
    </div>
  </section>

  <!-- Diferencias -->
  <section class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-16">
        <SectionLabel text="Qué nos diferencia" {isLight} />
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Experiencias <span class={isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia bg-clip-text text-transparent' : 'bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent'}>MAPI</span>
        </h2>
        <p class="mt-3 text-base tracking-wide transition-colors duration-500 {isLight ? 'text-gray-400' : 'text-gray-500'}">
          Medibles · Asequibles · Personalizadas · Innovadoras
        </p>
      </FadeIn>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each features as f, i}
          <MagneticRepel strength={52} radius={185}>
            <FadeIn delay={i * 0.09}>
              <TiltCard className="group h-full p-7 rounded-2xl border transition-all duration-300 cursor-default {isLight ? `bg-gradient-to-br ${f.lightGrad} bg-white/90 border-gray-100 ${f.hoverLight} backdrop-blur-sm` : 'bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/45 hover:bg-[#00c8ff]/6 backdrop-blur-sm'}">
                <MagneticAttract strength={18} radius={82}>
                  <div class="text-4xl mb-5">{f.icon}</div>
                </MagneticAttract>
                <h3 class="text-base font-bold mb-2 {isLight ? 'text-gray-900' : 'text-white'}">{f.title}</h3>
                <p class="text-sm leading-relaxed {isLight ? 'text-gray-500' : 'text-gray-400'}">{f.desc}</p>
              </TiltCard>
            </FadeIn>
          </MagneticRepel>
        {/each}
      </div>
    </div>
  </section>

  <!-- Servicios (FlipCards) -->
  <section class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-16">
        <SectionLabel text="Lo que hacemos" {isLight} />
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Tres líneas de <span class={isLight ? 'bg-gradient-to-r from-brand-orange to-brand-magenta bg-clip-text text-transparent' : 'bg-gradient-to-r from-blue-300 to-azul bg-clip-text text-transparent'}>impacto real</span>
        </h2>
        <p class="mt-3 text-sm transition-colors duration-500 {isLight ? 'text-gray-400' : 'text-gray-500'}">
          Haz click en cada tarjeta para revelar su contenido
        </p>
      </FadeIn>
      <div class="grid md:grid-cols-3 gap-6">
        {#each services as s, i}
          <FadeIn delay={i * 0.12}>
            <FlipCard icon={s.icon} title={s.title} desc={s.desc} gradient={s.gradient} {isLight} />
          </FadeIn>
        {/each}
      </div>
    </div>
  </section>

  <!-- Metodología -->
  <section class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-20">
        <SectionLabel text="Nuestra Metodología" {isLight} />
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Un proceso diseñado para <span class={isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-orange bg-clip-text text-transparent' : 'bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent'}>garantizar resultados</span>
        </h2>
      </FadeIn>

      <div class="relative">
        <div class="hidden lg:block absolute top-10 left-[16.66%] right-[16.66%] h-px {isLight ? 'bg-gradient-to-r from-brand-magenta via-brand-yellow to-brand-orange' : 'bg-gradient-to-r from-azul/40 to-blue-400/40'}"></div>
        <div class="grid lg:grid-cols-3 gap-10">
          {#each metodologiaSteps as step, i}
            <FadeIn delay={i * 0.18}>
              <div class="flex flex-col items-center text-center">
                <div
                  class="relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white mb-6 shadow-xl transition-transform duration-300 hover:scale-110"
                  style="background-color: {isLight ? step.colorLight : step.colorDark}"
                >
                  {step.num}
                  <div class="absolute inset-0 rounded-full opacity-40 blur-md" style="background-color: {isLight ? step.colorLight : step.colorDark}"></div>
                </div>
                <h3 class="text-xl font-black mb-3 {isLight ? 'text-gray-900' : 'text-white'}">
                  {#each step.title.split('-') as part, pi}
                    {#if part === 'IA'}
                      <span style="color: {isLight ? step.colorLight : step.colorDark}">IA</span>
                    {:else}
                      {part}{pi < step.title.split('-').length - 1 ? '-' : ''}
                    {/if}
                  {/each}
                </h3>
                <p class="text-sm leading-relaxed max-w-xs {isLight ? 'text-gray-500' : 'text-gray-400'}">{step.desc}</p>
              </div>
            </FadeIn>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Resultados -->
  <section class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {isLight ? 'bg-gradient-to-br from-[#f0a0c0] via-[#dc80c8] to-[#f8c090]' : 'bg-[#060d1a]/95 backdrop-blur-sm'}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-16">
        <SectionLabel text="Nuestros Resultados" {isLight} white={isLight} />
        <h2 class="text-4xl sm:text-5xl font-black text-white">Nuestros números hablan</h2>
        <p class="mt-2 text-sm {isLight ? 'text-white/60' : 'text-gray-500'}">
          Haz clic en cualquier dato para verlo de nuevo
        </p>
      </FadeIn>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each stats as s, i}
          <FadeIn delay={i * 0.1}>
            <div
              role="button"
              tabindex="0"
              onclick={() => handleStatClick(i)}
              class="p-8 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none active:scale-95 {isLight ? 'bg-white/15 border-white/20 backdrop-blur-sm hover:bg-white/25' : 'bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/40 hover:bg-[#00c8ff]/5 backdrop-blur-sm'}"
            >
              <div class="text-5xl sm:text-6xl font-black mb-2 {isLight ? 'text-white' : ''}" style={!isLight ? `color: ${s.color}` : ''}>
                <Counter value={s.value} suffix={s.suffix} replay={replays[i]} />
              </div>
              <p class="text-sm leading-snug {isLight ? 'text-white/80' : 'text-gray-400'}">{s.label}</p>
            </div>
          </FadeIn>
        {/each}
      </div>
    </div>
  </section>

  <!-- Equipo -->
  <section class="relative py-28 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight, true)}">
    <div class="max-w-7xl mx-auto relative z-10">
      <FadeIn className="text-center mb-16">
        <SectionLabel text="Nuestro Equipo" {isLight} />
        <h2 class="text-4xl sm:text-5xl font-black transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Personas que hacen posible la <span class={isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia bg-clip-text text-transparent' : 'bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent'}>magia</span>
        </h2>
        <p class="mt-4 text-base max-w-2xl mx-auto leading-relaxed {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Combinamos perfiles de tecnología, diseño de experiencias, producción de eventos y
          formación, con un denominador común: la convicción de que la IA, bien aplicada,
          puede hacer los eventos más humanos.
        </p>
      </FadeIn>

      <div class="grid lg:grid-cols-5 gap-8 items-stretch">
        <FadeIn delay={0.1} from="left" className="lg:col-span-2">
          <TiltCard className="block">
            <div class="rounded-2xl overflow-hidden border {isLight ? 'border-brand-magenta/15 bg-white/90 backdrop-blur-sm' : 'border-white/8 bg-[#0d1829]/80 backdrop-blur-sm'}">
              <div class="relative overflow-hidden h-[280px]">
                <img src="/team/guillermo-ganador.png" alt="Guillermo Prado — Ganador Event Industry Entrepreneur 2025" class="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105" />
              </div>
              <div class="p-6">
                <div class="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3 {isLight ? 'bg-brand-magenta/10 text-brand-magenta' : 'bg-azul/10 text-azul'}">Fundador & CEO</div>
                <h3 class="text-xl font-black {isLight ? 'text-gray-900' : 'text-white'}">Guillermo Prado Vázquez</h3>
                <p class="mt-2 text-sm leading-relaxed {isLight ? 'text-gray-500' : 'text-gray-400'}">
                  Doctor en Biociencias Moleculares (UAM) · Exinvestigador Hospital La Paz · Especialista en IA aplicada a eventos MICE
                </p>
                <div class="mt-4 flex flex-wrap gap-2">
                  {#each ['🥇 Event Industry Entrepreneur — Ganador', '🏆 Innovation Champion — Finalista'] as b}
                    <span class="text-xs px-3 py-1 rounded-full font-medium {isLight ? 'bg-brand-magenta/8 text-brand-magenta border border-brand-magenta/20' : 'bg-azul/10 text-azul border border-azul/20'}">{b}</span>
                  {/each}
                </div>
              </div>
            </div>
          </TiltCard>
        </FadeIn>

        <FadeIn delay={0.25} from="right" className="lg:col-span-3 flex flex-col justify-between gap-6">
          <TiltCard className="block">
            <div class="relative rounded-2xl overflow-hidden border {isLight ? 'border-brand-magenta/15' : 'border-white/8'}">
              <img src="/team/equipo-mpi.png" alt="Equipo Externia en MPI Iberian Chapter" class="w-full h-[420px] object-cover object-center transition-transform duration-700 hover:scale-105" />
              <div class="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md border {isLight ? 'bg-white/85 border-brand-magenta/15' : 'bg-black/75 border-white/10'}">
                <p class="text-xs font-bold tracking-widest uppercase {isLight ? 'text-brand-magenta' : 'text-azul'}">MPI Iberian Chapter · Valencia 2025</p>
                <p class="text-sm mt-0.5 {isLight ? 'text-gray-700' : 'text-gray-300'}">Equipo Externia en el Global Meetings Industry Day</p>
              </div>
            </div>
          </TiltCard>

          <div class="grid grid-cols-3 gap-4">
            {#each valueCards as v}
              <div class="p-4 rounded-xl text-center border transition-all duration-300 hover:-translate-y-1 {isLight ? 'bg-white/90 border-gray-100 backdrop-blur-sm' : 'bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/40 hover:bg-[#00c8ff]/5 backdrop-blur-sm'}">
                <MagneticAttract strength={18} radius={65}>
                  <div class="text-2xl mb-2">{v.icon}</div>
                </MagneticAttract>
                <p class="text-xs font-semibold {isLight ? 'text-gray-700' : 'text-gray-300'}">{v.label}</p>
              </div>
            {/each}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="relative py-32 px-4 overflow-hidden transition-colors duration-500 {sectionBg(isLight)}">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-12 pointer-events-none transition-colors duration-500 {isLight ? 'bg-brand-magenta' : 'bg-azul'}"></div>

    <div class="max-w-3xl mx-auto text-center relative z-10">
      <FadeIn>
        <SectionLabel text="¿Listo para el cambio?" {isLight} />
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
          Transforma tu próximo evento con <span class={isLight ? 'bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-brand-orange bg-clip-text text-transparent' : 'bg-gradient-to-r from-azul via-blue-300 to-azul bg-clip-text text-transparent'}>Inteligencia Artificial</span>
        </h2>
        <p class="text-lg mb-10 transition-colors duration-500 {isLight ? 'text-gray-500' : 'text-gray-400'}">
          Descubre cómo Externia puede crear una experiencia MAPI para tu próximo evento.
        </p>

        <a
          href="/servicios"
          class="relative inline-block overflow-hidden px-12 py-5 rounded-full text-lg font-bold text-white transition-shadow duration-300 {isLight ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia' : 'bg-azul'}"
          style={ctaHovered ? (isLight ? 'box-shadow: 0 0 50px #DE3B8490, 0 0 100px #D6007D40' : 'box-shadow: 0 0 50px #0070f390, 0 0 100px #0070f340') : ''}
          onmouseenter={onBtnEnter}
          onmouseleave={onBtnLeave}
        >
          <span class="invisible whitespace-nowrap">Ver nuestros servicios →</span>
          <span bind:this={primaryRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(0%)">
            Ver nuestros servicios →
          </span>
          <span bind:this={cloneRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(-110%)">
            Ver nuestros servicios →
          </span>
        </a>

        <p class="mt-6 text-sm transition-colors duration-500 {isLight ? 'text-gray-400' : 'text-gray-500'}">
          O escríbenos a <a href="mailto:hola@externia.ai" class="font-semibold underline underline-offset-2 {isLight ? 'text-brand-magenta hover:text-brand-fuchsia' : 'text-azul hover:text-blue-300'}">hola@externia.ai</a>
        </p>
      </FadeIn>
    </div>
  </section>
</div>
