<script lang="ts">
  import '../app.css';
  import { onMount, type Snippet } from 'svelte';
  import { page } from '$app/stores';
  import { getSeo, isBlogArticlePath, isTravelManagerPath } from '$lib/seo';
  import {
    buildGraphOrganizationWebSite,
    maybeBreadcrumbSchema,
    toJsonLdString
  } from '$lib/seo/json-ld';
  import Navbar from '$lib/components/Navbar.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children }: { children?: Snippet } = $props();

  const pathname = $derived($page.url.pathname);
  const seo = $derived(getSeo(pathname));
  const isBlogArticle = $derived(isBlogArticlePath(pathname));
  const isTravelManager = $derived(isTravelManagerPath(pathname));
  const canonicalUrl = $derived(`${$page.url.origin}${pathname === '/' ? '' : pathname}`);
  const ogImageUrl = $derived(`${$page.url.origin}/externia-icon.svg`);

  let scrollProgress = $state(0);

  onMount(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        scrollProgress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
      } else {
        scrollProgress = 0;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const jsonLdGraph = $derived(
    buildGraphOrganizationWebSite($page.url.origin, getSeo('/').description)
  );
  const jsonLdBreadcrumb = $derived(
    isBlogArticle ? null : maybeBreadcrumbSchema($page.url.origin, pathname)
  );

  const jsonLdGraphTag = $derived(
    '<script type="application/ld+json">' + toJsonLdString(jsonLdGraph) + '<\/script>'
  );
  const jsonLdBreadcrumbTag = $derived(
    jsonLdBreadcrumb
      ? '<script type="application/ld+json">' + toJsonLdString(jsonLdBreadcrumb) + '<\/script>'
      : ''
  );
</script>

<svelte:head>
  {#if !isBlogArticle}
    <title>{seo.title}</title>
    <meta name="description" content={seo.description} />
  {/if}

  <link rel="canonical" href={canonicalUrl} />

  <meta property="og:site_name" content="Externia" />
  <meta property="og:locale" content="es_ES" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={ogImageUrl} />
  <meta property="og:image:alt" content="Externia" />

  {#if !isBlogArticle}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={seo.title} />
    <meta property="og:description" content={seo.description} />
  {:else}
    <meta property="og:type" content="article" />
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={ogImageUrl} />
  <meta name="twitter:url" content={canonicalUrl} />

  {#if !isBlogArticle}
    <meta name="twitter:title" content={seo.title} />
    <meta name="twitter:description" content={seo.description} />
  {/if}

  {@html jsonLdGraphTag}
  {#if jsonLdBreadcrumbTag}
    {@html jsonLdBreadcrumbTag}
  {/if}
</svelte:head>

<!-- Reading progress bar line fixed at top -->
<div
  class="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-azul origin-left transition-transform duration-75 ease-out pointer-events-none"
  style="transform: scaleX({scrollProgress})"
></div>

<!-- Noise texture overlay filter -->
<div class="pointer-events-none fixed inset-0 z-[99] opacity-[0.025] mix-blend-overlay bg-noise"></div>

{#if !isTravelManager}
  <Navbar />
  <ThemeToggle />
{/if}
<main class="theme-transition w-full min-w-0 overflow-x-hidden">
  {#if children}
    {@render children()}
  {/if}
</main>
{#if !isTravelManager}
  <Footer />
{/if}
