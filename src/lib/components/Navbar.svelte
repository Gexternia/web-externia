<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';

  const navLinks = [
    { label: 'Quiénes Somos', href: '/quienes-somos' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Formación', href: '/formacion' },
    { label: 'Contáctanos', href: '/contacto' }
  ];

  let isDark = $state(true);
  let menuOpen = $state(false);
  let isHome = $state(true);
  let scrolled = $state(false);
  const navY = spring(-100, { stiffness: 0.2, damping: 0.7 });

  onMount(() => {
    navY.set(0);
    isHome = window.location.pathname === '/' || window.location.pathname === '';
    isDark = !document.documentElement.classList.contains('light');

    const themeHandler = () => {
      isDark = !document.documentElement.classList.contains('light');
    };
    const scrollHandler = () => { scrolled = window.scrollY > 50; };

    window.addEventListener('themechange', themeHandler);
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('themechange', themeHandler);
      window.removeEventListener('scroll', scrollHandler);
    };
  });
</script>

<nav
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled && isDark ? 'bg-black/80 backdrop-blur-md' : scrolled && !isDark ? 'bg-white/80 backdrop-blur-md' : 'bg-transparent'}"
  style="transform: translateY({$navY}px)"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 sm:h-20">
      <div class="flex-shrink-0">
        {#if !isHome}
          <a href="/">
            <img
              src={isDark ? '/logo-externia-clean.png' : '/logo-externia-light-fixed.png'}
              alt="Externia — Inicio"
              class="h-8 sm:h-10 w-auto object-contain"
            />
          </a>
        {/if}
      </div>

      <div class="hidden md:flex items-center space-x-8">
        {#each navLinks as link}
          <a
            href={link.href}
            class="text-sm font-medium tracking-wide transition-colors duration-200 {isDark ? 'text-gray-300 hover:text-azul' : 'text-gray-600 hover:text-brand-magenta'}"
          >
            {link.label}
          </a>
        {/each}
      </div>

      <button
        onclick={() => (menuOpen = !menuOpen)}
        class="md:hidden p-2 rounded-lg transition-colors {isDark ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-black/5'}"
        aria-label="Toggle menu"
      >
        {#if menuOpen}
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        {:else}
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        {/if}
      </button>
    </div>

    {#if menuOpen}
      <div class="md:hidden pb-4 overflow-hidden">
        {#each navLinks as link}
          <a
            href={link.href}
            class="block py-3 px-2 text-sm font-medium transition-colors {isDark ? 'text-gray-300 hover:text-azul' : 'text-gray-600 hover:text-brand-magenta'}"
          >
            {link.label}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</nav>
