<script lang="ts">
  import PageHero from '$lib/components/story/PageHero.svelte';
  import ActivationsCarousel from '$lib/components/story/ActivationsCarousel.svelte';
  import MapiLetters from '$lib/components/story/MapiLetters.svelte';
  import BigList from '$lib/components/story/BigList.svelte';
  import CtaClose from '$lib/components/story/CtaClose.svelte';
  import '$lib/components/story/story.css';

  const paraQuien = [
    { title: 'Activaciones de marca', desc: 'Donde el objetivo es generar efecto WOW y conexión emocional entre los asistentes y la marca.' },
    { title: 'Eventos corporativos', desc: 'Para enriquecer momentos de networking, entretener en cenas de gala y crear oportunidades de patrocinio únicas.' },
    { title: 'Ferias y congresos', desc: 'Para atraer un alto volumen de visitantes, captar su atención y dejar una impresión duradera.' },
    { title: 'Teambuilding e incentivos', desc: 'Activaciones lúdicas que refuerzan la cohesión de equipo y generan recuerdos compartidos.' }
  ];
</script>

<PageHero
  title={'Experiencias de IA\nque impactan.'}
  accent="IA"
  lead="Activaciones experienciales bajo la filosofía MAPI: Medible, Asequible, Personalizado e Innovador."
  ctas={[
    { href: '#activaciones', label: 'Ver activaciones' },
    { href: '/consultoria', label: 'Consultoría', ghost: true },
    { href: '/formacion', label: 'Formación', ghost: true }
  ]}
/>

<div id="activaciones">
  <ActivationsCarousel />
</div>

<MapiLetters />

<BigList heading="Diseñados para el impacto real" accent="impacto real" sub="¿Para qué eventos? Para cualquiera en el que quieras que la gente recuerde a tu marca." items={paraQuien} alt />

<CtaClose
  title="Tu próxima experiencia inolvidable."
  accent="inolvidable."
  text="Cuéntanos tu evento y te proponemos la solución MAPI perfecta para él."
/>

