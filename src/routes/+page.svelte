<script lang="ts">
  import HomeHero from '$lib/components/story/HomeHero.svelte';
  import LinesList from '$lib/components/story/LinesList.svelte';
  import ClientsWall from '$lib/components/story/ClientsWall.svelte';
  import LitStatement from '$lib/components/story/LitStatement.svelte';
  import CtaClose from '$lib/components/story/CtaClose.svelte';
</script>

<HomeHero />

<LitStatement
  text="La primera consultora de inteligencia artificial especializada al 100% en el sector MICE."
  strong="inteligencia artificial MICE."
  note="Especialistas en eventos que dominan la IA, desde 2024."
/>

<LinesList />

<ClientsWall />

<CtaClose
  title="CambIA tu próximo evento."
  accent="evento."
  text="Cuéntanos tu evento y te proponemos la solución MAPI perfecta: Medible, Asequible, Personalizada e Innovadora."
/>
