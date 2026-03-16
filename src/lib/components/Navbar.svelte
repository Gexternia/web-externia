<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { page } from '$app/stores';

  const isHome = $derived(($page.url.pathname === '/' || $page.url.pathname === '') ?? false);

  const navLinks = [
    { label: 'Quiénes Somos', href: '/quienes-somos' },
    { label: 'Activaciones', href: '/servicios' },
    { label: 'Consultoría', href: '/consultoria' },
    { label: 'Formación', href: '/formacion' },
    { label: 'Blog', href: '/digest' },
    { label: 'Contáctanos', href: '/contacto' }
  ];

  let isDark = $state(true);
  let menuOpen = $state(false);
  let scrolled = $state(false);
  const navY = spring(-100, { stiffness: 0.2, damping: 0.7 });

  function toggleTheme() {
    menuOpen = false;
    if (document.documentElement.classList.contains('light')) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      isDark = true;
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      isDark = false;
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: { isDark } }));
  }

  onMount(() => {
    navY.set(0);
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
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {(scrolled || menuOpen) && isDark ? 'bg-black/80 backdrop-blur-md' : (scrolled || menuOpen) && !isDark ? 'bg-white/80 backdrop-blur-md' : 'bg-transparent'}"
  style="transform: translateY({$navY}px)"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[100vw]">
    <div class="flex items-center justify-between h-14 sm:h-16 md:h-20">
      <div class="flex-shrink-0 -ml-1 sm:ml-0">
        {#if !isHome}
          <a href="/" class="block min-w-[44px] min-h-[44px] flex items-center">
            <img
              src={isDark ? '/logo-externia-clean.png' : '/logo-externia-light-fixed.png'}
              alt="Externia — Inicio"
              class="h-7 sm:h-8 md:h-10 w-auto object-contain"
            />
          </a>
        {/if}
      </div>

      <div class="hidden md:flex items-center gap-5 lg:gap-8 fixed right-24 top-0 h-14 sm:h-16 md:h-20">
        {#each navLinks as link}
          <a
            href={link.href}
            class="micro-link-underline text-sm font-medium tracking-wide transition-colors duration-300 {isDark ? 'text-gray-300 hover:text-azul' : 'text-gray-600 hover:text-brand-magenta'}"
          >
            {link.label}
          </a>
        {/each}
      </div>

      <button
        onclick={() => (menuOpen = !menuOpen)}
        class="md:hidden min-w-[44px] min-h-[44px] p-3 rounded-lg flex items-center justify-center transition-colors duration-300 micro-active-press {isDark ? 'text-white hover:bg-white/10' : 'text-gray-800 hover:bg-black/5'}"
        aria-label="Abrir menú"
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
            onclick={() => (menuOpen = false)}
            class="micro-link-underline block py-4 px-4 text-base font-medium transition-colors duration-300 micro-active-press min-h-[48px] flex items-center {isDark ? 'text-gray-300 hover:text-azul' : 'text-gray-600 hover:text-brand-magenta'}"
          >
            {link.label}
          </a>
        {/each}
        <button
          type="button"
          onclick={toggleTheme}
          class="micro-link-underline w-full text-left py-4 px-4 text-base font-medium transition-colors duration-300 micro-active-press min-h-[48px] flex items-center border-t {isDark ? 'text-gray-300 hover:text-azul border-white/10' : 'text-gray-600 hover:text-brand-magenta border-gray-200'}"
        >
          {isDark ? 'Modo claro' : 'Modo oscuro'}
        </button>
      </div>
    {/if}
  </div>
</nav>
