<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';

  let isDark = $state(true);
  let scrollY = $state(0);
  const initialOpacity = spring(0, { stiffness: 0.4, damping: 0.6 });
  const initialY = spring(40, { stiffness: 0.4, damping: 0.6 });
  let opacity = $derived(Math.max(0, 1 - scrollY / 300));
  let scale = $derived(Math.max(0.3, 1 - (scrollY / 300) * 0.7));
  let y = $derived(Math.max(-150, -(scrollY / 300) * 150));

  onMount(() => {
    initialOpacity.set(1);
    initialY.set(0);
    isDark = !document.documentElement.classList.contains('light');
    const themeHandler = () => {
      isDark = !document.documentElement.classList.contains('light');
    };
    window.addEventListener('themechange', themeHandler);

    const scrollHandler = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('themechange', themeHandler);
      window.removeEventListener('scroll', scrollHandler);
    };
  });
</script>

<div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center pointer-events-none">
  <img
    src={isDark ? '/logo-externia-clean.png' : '/logo-externia-light-fixed.png'}
    alt="Externia"
    class="w-[360px] sm:w-[500px] md:w-[650px] lg:w-[800px] mx-auto object-contain drop-shadow-lg transition-opacity duration-100"
    style="opacity: {opacity * $initialOpacity}; transform: scale({scale}) translateY({$initialY * Math.max(0, 1 - scrollY/300) + y * Math.min(1, scrollY/300)}px)"
  />
</div>
