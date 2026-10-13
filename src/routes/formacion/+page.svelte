<script lang="ts">
  import PageHero from '$lib/components/story/PageHero.svelte';
  import LitStatement from '$lib/components/story/LitStatement.svelte';
  import StackCards from '$lib/components/story/StackCards.svelte';
  import BigList from '$lib/components/story/BigList.svelte';
  import CtaClose from '$lib/components/story/CtaClose.svelte';
  import { reveal } from '$lib/components/story/reveal';
  import '$lib/components/story/story.css';

  const programs = [
    {
      num: '01',
      title: 'Taller Introductorio',
      level: 'Nivel básico',
      intro: 'Para profesionales que quieren dar sus primeros pasos en la IA de forma práctica, sin tecnicismos y aplicada directamente a su día a día en eventos. Resultados visibles desde la primera sesión.',
      listTitle: '¿Qué aprenderás?',
      items: [
        'Qué es la IA y cómo funciona en la práctica: conceptos clave sin jerga técnica, orientados a la toma de decisiones.',
        'Las herramientas de IA más útiles para eventos: ChatGPT, Claude, Midjourney, Canva AI, Notion AI y otras soluciones aplicadas a la producción y comunicación de eventos.',
        'Prompting efectivo para eventos: cómo escribir instrucciones precisas para obtener resultados profesionales en briefings, propuestas, copies y creatividades.',
        'Automatización de tareas repetitivas: correos, informes, resúmenes de reuniones, cronogramas y documentación con IA.',
        'Casos de uso reales del sector: ejemplos concretos de cómo agencias y organizadores ya están usando la IA en España.'
      ],
      duracion: '4 horas (formato intensivo) o 2 sesiones de 2 horas',
      dirigido: 'Equipos de agencias, coordinadores de eventos, técnicos de comunicación',
      modalidad: 'Presencial, online o híbrida'
    },
    {
      num: '02',
      title: 'Programa Avanzado',
      level: 'Nivel estratégico',
      intro: 'Para profesionales que ya conocen las bases de la IA y quieren desarrollar una visión estratégica completa, integrando la inteligencia artificial en sus flujos de trabajo, propuestas y modelo de negocio.',
      listTitle: '¿Qué aprenderás?',
      items: [
        'Estrategia de IA para agencias de eventos: cómo posicionar la IA como ventaja competitiva frente a clientes y en procesos de licitación.',
        'Diseño de flujos de trabajo con IA: automatización de propuestas, briefings, seguimiento de clientes, gestión de proveedores y reporting.',
        'IA para la experiencia del asistente: herramientas y metodologías para diseñar activaciones, personalización y engagement con IA.',
        'Creación de contenido con IA: generación de imágenes, vídeos cortos, copies para RRSS, dossieres y presentaciones de forma ágil y profesional.',
        'Análisis de datos e informes de impacto: cómo usar IA para interpretar datos de asistentes, medir ROI y generar informes automatizados.',
        'Marco legal y ético: Ley de IA de la UE, protección de datos (RGPD), uso responsable de IA generativa y derechos de imagen.',
        'Herramientas avanzadas y agentes de IA: introducción a flujos de trabajo con agentes de IA, Make/Zapier con IA, GPTs personalizados para el sector.'
      ],
      duracion: '16 horas (4 sesiones de 4 horas) o formato intensivo de 2 días',
      dirigido: 'Directores de agencias, project managers, responsables de innovación',
      modalidad: 'Presencial, online o híbrida — con acceso a materiales y recursos tras la formación'
    },
    {
      num: '03',
      title: 'Formación a Medida',
      level: 'Personalizado',
      intro: 'Diseñamos programas completamente personalizados para empresas, departamentos o equipos con necesidades específicas. Desde una sesión de sensibilización para directivos hasta un programa de certificación interna para un equipo completo.',
      listTitle: '¿Cómo funciona?',
      items: [
        'Diagnóstico inicial: analizamos el nivel actual del equipo, los objetivos de negocio y las herramientas que ya utilizan.',
        'Diseño del programa: creamos un itinerario formativo adaptado, con los módulos, la duración y el ritmo que mejor se ajustan al equipo.',
        'Impartición: presencial en las instalaciones del cliente, online o híbrida, con materiales y ejercicios prácticos del sector.',
        'Seguimiento: sesión de resolución de dudas post-formación y acceso a recursos complementarios durante 30 días.'
      ],
      duracion: 'Flexible — de 2 horas a varios días según las necesidades del cliente',
      dirigido: 'Empresas, departamentos de eventos, equipos de marketing y comunicación',
      modalidad: 'Adaptada al cliente — presencial, online o híbrida',
      extra: 'Hemos desarrollado programas a medida para agencias de comunicación y eventos, departamentos de marketing de IBEX 35 y equipos de producción que quieren integrar la IA en su operativa real sin interrumpir su flujo de trabajo habitual.'
    }
  ];

  const publicos = [
    { title: 'Agencias de eventos y comunicación', desc: 'que quieren incorporar la IA en sus propuestas, operativa y diferenciación frente a la competencia.' },
    { title: 'Departamentos de marketing y eventos de empresa', desc: 'que organizan eventos internos, lanzamientos de producto o convenciones y quieren hacerlo con más eficiencia e impacto.' },
    { title: 'Profesionales independientes del sector', desc: 'coordinadores freelance, consultores y técnicos de eventos que quieren actualizar sus competencias y ser más competitivos.' },
    { title: 'Equipos de ventas de espacios y venues', desc: 'que necesitan entender la IA para responder mejor a las demandas de sus clientes organizadores.' }
  ];

  const diferencias = [
    { title: '100% aplicada al sector MICE y eventos', desc: 'No enseñamos IA genérica. Cada ejemplo, herramienta y ejercicio está pensado para la realidad de un profesional de eventos.' },
    { title: 'Formador con credencial científica y experiencia de sector', desc: 'Una combinación que no encontrarás en ninguna otra formación del mercado español.' },
    { title: 'Práctica desde el primer minuto', desc: 'Nada de diapositivas interminables: trabajamos con herramientas reales y casos aplicables desde el mismo día.' },
    { title: 'Actualización continua', desc: 'El mundo de la IA cambia cada semana. Nuestros programas se actualizan constantemente para incluir las herramientas y tendencias más relevantes.' },
    { title: 'Cumplimiento legal integrado', desc: 'Abordamos el uso ético y legal de la IA desde el inicio, incluyendo la Ley de IA de la UE y el RGPD aplicado al sector.' }
  ];
</script>

<PageHero
  title={'Formaciones en IA\npara eventos'}
  accent="IA"
  lead="Aprende IA aplicada al sector que conoces. No enseñamos IA genérica: enseñamos IA aplicada a las necesidades de quienes organizan, producen y venden eventos."
  meta="Presencial · Online · A medida"
  ctas={[{ href: '#programas', label: 'Ver programas' }, { href: '/contacto', label: 'Contactar', ghost: true }]}
/>

<!-- ¿Por qué formarse con Externia? -->
<section class="xs xs-section why">
  <div class="xs-wrap grid2">
    <div class="photo" data-rv="mask" use:reveal>
      <img src="/team/guillermo-premio.webp" alt="Dr. Guillermo Prado Vázquez en los MPI Iberian Awards 2025" loading="lazy" decoding="async" />
    </div>
    <div class="copy">
      <h2 class="xs-h2" data-rv use:reveal>IA que entiende tu <em>sector.</em></h2>
      <p data-rv use:reveal style="--d: 80ms">La inteligencia artificial ya está redefiniendo la industria de los eventos. Sin embargo, la mayoría de la formación en IA disponible es genérica, orientada a desarrolladores o desconectada de la realidad del sector MICE.</p>
      <p data-rv use:reveal style="--d: 120ms">En Externia lo hacemos diferente: enseñamos IA aplicada exactamente al trabajo de quienes organizan, producen, venden y diseñan eventos.</p>
      <p data-rv use:reveal style="--d: 160ms">Nuestros programas están diseñados y liderados por el <strong>Dr. Guillermo Prado Vázquez</strong> — investigador en IA, especialista en eventos y finalista del Innovation Champion en los MPI Iberian Awards 2025 — con una visión única: la de alguien que domina la tecnología y vive el sector desde dentro.</p>
    </div>
  </div>
</section>

<LitStatement text="No enseñamos herramientas. Enseñamos a pensar con IA." strong="pensar IA." />

<div id="programas">
  <StackCards
    {programs}
    heading={'Tres niveles, un mismo <em>objetivo.</em>'}
    sub="Del primer contacto con la IA a un programa diseñado para tu equipo."
  />
</div>

<BigList heading="Dirigido a quienes quieren liderar con IA" accent="liderar IA" items={publicos} alt />

<BigList heading="Cinco razones para elegir Externia" accent="Externia" items={diferencias} numbered />

<CtaClose
  title="Da el siguiente paso con IA aplicada a eventos."
  accent="IA eventos."
  text="Elige el programa que mejor se adapte a tu equipo y contacta con nosotros. Te respondemos sin compromiso."
  label="Contactar"
/>

<style>
  .why { overflow: hidden; }
  .grid2 { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(40px, 7vw, 112px); align-items: center; }
  .photo { position: relative; aspect-ratio: 3 / 4; border-radius: 28px; overflow: hidden; }
  .photo img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
  .photo::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 8px; background: var(--xs-brand); }
  .copy { display: grid; gap: 22px; }
  .copy p { margin: 0; font-size: clamp(17px, 1.35vw, 20px); line-height: 1.65; color: var(--xs-muted); max-width: 58ch; }
  .copy strong { color: var(--xs-ink); }
  @media (max-width: 900px) {
    .grid2 { grid-template-columns: 1fr; }
    .photo { max-width: 360px; }
  }
</style>
