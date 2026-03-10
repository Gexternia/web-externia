<script lang="ts">
  interface Props {
    text: string;
    isLight: boolean;
    white?: boolean;
  }

  let { text, isLight, white = false }: Props = $props();
</script>

{#if white}
  <span class="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-white/20 text-white">
    {text}
  </span>
{:else}
  <span
    class="inline-block px-5 py-2 rounded-full text-base font-bold tracking-widest uppercase mb-4 transition-colors duration-500 {isLight
      ? 'bg-brand-magenta/10 text-brand-magenta'
      : 'bg-azul/10 text-azul'}"
  >
    {text}
  </span>
{/if}
