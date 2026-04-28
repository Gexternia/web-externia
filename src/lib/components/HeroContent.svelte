<script lang="ts">
  import { onMount } from 'svelte';

  let isDark = $state(true);

  onMount(() => {
    isDark = !document.documentElement.classList.contains('light');
    const themeHandler = () => {
      isDark = !document.documentElement.classList.contains('light');
    };
    window.addEventListener('themechange', themeHandler);
    return () => {
      window.removeEventListener('themechange', themeHandler);
    };
  });
</script>

<div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center pointer-events-none">
  <a
    href="/quienes-somos"
    class="micro-active-press block pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 {isDark ? 'focus:ring-azul' : 'focus:ring-brand-magenta'}"
    aria-label="Ir a Quiénes Somos"
  >
    {#key isDark}
      <video
        src={isDark ? '/externia-blanco-sin-fondo.webm' : '/externia-sin-fondo.webm'}
        autoplay
        loop
        muted
        playsinline
        class="w-[960px] max-w-full mx-auto object-contain drop-shadow-lg"
      />
    {/key}
  </a>
</div>
