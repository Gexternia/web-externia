<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';

  let { mobileVisible = false }: { mobileVisible?: boolean } = $props();

  let isDark = $state(true);
  const scale = spring(0.8, { stiffness: 0.5, damping: 0.5 });

  onMount(() => {
    if (localStorage.getItem('theme') === 'light') {
      isDark = false;
      document.documentElement.classList.add('light');
    }
    scale.set(1);
  });

  function toggle() {
    isDark = !isDark;
    if (isDark) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
    window.dispatchEvent(new CustomEvent('themechange', { detail: { isDark } }));
  }
</script>

<button
  onclick={toggle}
  class="micro-active-press {mobileVisible ? 'flex' : 'hidden md:flex'} fixed top-6 right-6 z-50 items-center justify-center w-11 h-11 rounded-full backdrop-blur-xl transition-all duration-300 hover:scale-105 min-w-[44px] min-h-[44px] {isDark ? 'bg-gradient-to-b from-white/18 via-white/10 to-white/5 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_rgba(0,0,0,0.5)] text-slate-200 hover:border-white/40' : 'bg-gradient-to-b from-slate-100/90 via-white/70 to-slate-200/60 border border-slate-300/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_4px_14px_rgba(0,0,0,0.1)] text-slate-700 hover:border-slate-400'}"
  style="transform: scale({$scale}); pointer-events: auto"
  aria-label="Toggle theme"
>
  {#if isDark}
    <!-- Sun icon - clean crisp white/silver metallic -->
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-100 transition-transform duration-300 hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="4"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  {:else}
    <!-- Moon icon - clean slate metallic -->
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-slate-800 transition-transform duration-300 -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  {/if}
</button>
