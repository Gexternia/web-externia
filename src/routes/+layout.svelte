<script lang="ts">
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<Navbar />
<ThemeToggle />
<main class="theme-transition">
  <slot />
</main>
<Footer />
