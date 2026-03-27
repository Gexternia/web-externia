<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import Navbar from '$lib/components/Navbar.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import Footer from '$lib/components/Footer.svelte';

  const ogImageUrl = $derived(`${$page.url.origin}/Logo.svg`);
</script>

<svelte:head>
  <meta property="og:image" content={ogImageUrl} />
  <meta property="og:image:alt" content="Externia" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={ogImageUrl} />
</svelte:head>

<Navbar />
<ThemeToggle />
<main class="theme-transition w-full min-w-0 overflow-x-hidden">
  <slot />
</main>
<Footer />
