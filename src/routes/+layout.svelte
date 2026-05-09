<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { getSeo, isBlogArticlePath } from '$lib/seo';
  import {
    buildGraphOrganizationWebSite,
    maybeBreadcrumbSchema,
    toJsonLdString
  } from '$lib/seo/json-ld';
  import Navbar from '$lib/components/Navbar.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import Footer from '$lib/components/Footer.svelte';

  const pathname = $derived($page.url.pathname);
  const seo = $derived(getSeo(pathname));
  const isBlogArticle = $derived(isBlogArticlePath(pathname));
  const canonicalUrl = $derived(`${$page.url.origin}${pathname === '/' ? '' : pathname}`);
  const ogImageUrl = $derived(`${$page.url.origin}/externia-icon.svg`);

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

<Navbar />
<ThemeToggle />
<main class="theme-transition w-full min-w-0 overflow-x-hidden">
  <slot />
</main>
<Footer />
