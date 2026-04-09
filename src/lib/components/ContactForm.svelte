<script lang="ts">
  /**
   * Contáctanos — Envía a Formspree (PUBLIC_CONTACT_FORM_URL) o a /api/contact si no está definida.
   */
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  import FadeIn from '$lib/components/shared/FadeIn.svelte';

  /** Si true, siempre fondo blanco y estilo claro (p. ej. en página Contacto, como Servicios). */
  /** Si true, la sección no aplica fondo propio (el padre ya lo gestiona). */
  let { forceLight = false, noBg = false } = $props();
  let isLight = $state(false);
  let effectiveLight = $derived(forceLight || isLight);

  // Datos del formulario — al conectar Resend, enviar estos campos
  let form = $state({
    nombre: '',
    email: '',
    empresa: '',
    mensaje: ''
  });
  let sending = $state(false);
  let submitted = $state(false);
  let errorMessage = $state<string | null>(null);

  let ctaHovered = $state(false);
  let primaryRef: HTMLSpanElement;
  let cloneRef: HTMLSpanElement;
  const TR = 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)';

  function onBtnEnter() {
    if (sending) return;
    ctaHovered = true;
    if (!primaryRef || !cloneRef) return;
    primaryRef.style.transition = 'none';
    primaryRef.style.transform = 'translateX(0%)';
    cloneRef.style.transition = 'none';
    cloneRef.style.transform = 'translateX(-110%)';
    primaryRef.getBoundingClientRect();
    primaryRef.style.transition = TR;
    primaryRef.style.transform = 'translateX(110%)';
    cloneRef.style.transition = TR;
    cloneRef.style.transform = 'translateX(0%)';
  }

  function onBtnLeave() {
    ctaHovered = false;
    if (!primaryRef || !cloneRef) return;
    primaryRef.style.transition = 'none';
    primaryRef.style.transform = 'translateX(-110%)';
    cloneRef.style.transition = 'none';
    cloneRef.style.transform = 'translateX(0%)';
    cloneRef.getBoundingClientRect();
    cloneRef.style.transition = TR;
    cloneRef.style.transform = 'translateX(110%)';
    primaryRef.style.transition = TR;
    primaryRef.style.transform = 'translateX(0%)';
  }

  onMount(() => {
    isLight = document.documentElement.classList.contains('light');
    const handler = () => {
      isLight = document.documentElement.classList.contains('light');
    };
    window.addEventListener('themechange', handler);
    return () => window.removeEventListener('themechange', handler);
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (sending || submitted) return;
    sending = true;
    errorMessage = null;
    const url = env.PUBLIC_CONTACT_FORM_URL || 'https://formspree.io/f/mgonqpad';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          empresa: form.empresa,
          mensaje: form.mensaje
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        errorMessage = (data as { error?: string }).error || 'No se pudo enviar. Intenta más tarde.';
        return;
      }
      submitted = true;
      form = { nombre: '', email: '', empresa: '', mensaje: '' };
    } catch {
      errorMessage = 'Error de conexión. Comprueba tu red e inténtalo de nuevo.';
    } finally {
      sending = false;
    }
  }
</script>

<section
  id="formulario-contacto"
  class="relative {noBg ? 'pt-6 pb-24 sm:pb-32' : 'py-24 sm:py-32'} px-4 overflow-hidden transition-colors duration-500 {noBg ? '' : (effectiveLight ? 'bg-white/65' : 'bg-[#060d1a]/72')} {noBg ? '' : 'backdrop-blur-[2px]'}"
>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 pointer-events-none transition-colors duration-500 {effectiveLight ? 'bg-brand-magenta' : 'bg-azul'}"></div>

  <div class="max-w-2xl mx-auto relative z-10">
    <FadeIn class="text-center mb-12">
      <span
        class="inline-block px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-4 transition-colors duration-500 {effectiveLight ? 'bg-brand-magenta/15 text-[#a82a5f]' : 'bg-white/15 text-blue-200'}"
      >
        Contáctanos
      </span>
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4 transition-colors duration-500 {effectiveLight ? 'text-gray-900' : 'text-white'}">
        Cuéntanos tu <span class="gradient-text-animate">proyecto</span>
      </h2>
      <p class="text-base sm:text-lg transition-colors duration-500 {effectiveLight ? 'text-gray-600' : 'text-gray-200'}">
        Rellena el formulario y te respondemos lo antes posible.
      </p>
    </FadeIn>

    <FadeIn delay={0.1}>
      {#if submitted}
        <div
          class="rounded-2xl border p-8 text-center transition-colors duration-500 {effectiveLight ? 'shadow-card-light shadow-card-light-hover bg-white/90 border-brand-magenta/20 text-gray-800' : 'bg-[#0d1829]/90 border-azul/30 text-gray-200'}"
        >
          <p class="text-lg font-semibold mb-2">Mensaje enviado</p>
          <p class="text-sm opacity-90">Gracias por contactar. Te responderemos pronto.</p>
          <button
            type="button"
            onclick={() => (submitted = false)}
            class="mt-6 text-sm font-bold transition-colors duration-500 {effectiveLight ? 'text-brand-magenta hover:underline' : 'text-azul hover:underline'}"
          >
            Enviar otro mensaje
          </button>
        </div>
      {:else}
        <form
          onsubmit={handleSubmit}
          class="rounded-2xl border p-6 sm:p-8 transition-colors duration-500 {effectiveLight ? 'shadow-card-light shadow-card-light-hover bg-white/90 border-gray-200' : 'bg-[#0d1829]/90 border-white/10'}"
        >
          <div class="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label for="contacto-nombre" class="block text-sm font-bold mb-2 transition-colors duration-500 {effectiveLight ? 'text-gray-700' : 'text-gray-300'}">Nombre *</label>
              <input
                id="contacto-nombre"
                type="text"
                name="nombre"
                required
                bind:value={form.nombre}
                class="w-full px-4 py-3 rounded-xl border transition-colors duration-500 {effectiveLight ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-magenta focus:ring-2 focus:ring-brand-magenta/20' : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-azul focus:ring-2 focus:ring-azul/20'}"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label for="contacto-email" class="block text-sm font-bold mb-2 transition-colors duration-500 {effectiveLight ? 'text-gray-700' : 'text-gray-300'}">Email *</label>
              <input
                id="contacto-email"
                type="email"
                name="email"
                required
                bind:value={form.email}
                class="w-full px-4 py-3 rounded-xl border transition-colors duration-500 {effectiveLight ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-magenta focus:ring-2 focus:ring-brand-magenta/20' : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-azul focus:ring-2 focus:ring-azul/20'}"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div class="mb-5">
            <label for="contacto-empresa" class="block text-sm font-bold mb-2 transition-colors duration-500 {effectiveLight ? 'text-gray-700' : 'text-gray-300'}">Empresa <span class="font-normal opacity-70">(opcional)</span></label>
            <input
              id="contacto-empresa"
              type="text"
              name="empresa"
              bind:value={form.empresa}
              class="w-full px-4 py-3 rounded-xl border transition-colors duration-500 {effectiveLight ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-magenta focus:ring-2 focus:ring-brand-magenta/20' : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-azul focus:ring-2 focus:ring-azul/20'}"
              placeholder="Tu empresa o proyecto"
            />
          </div>
          <div class="mb-6">
            <label for="contacto-mensaje" class="block text-sm font-bold mb-2 transition-colors duration-500 {effectiveLight ? 'text-gray-700' : 'text-gray-300'}">Mensaje *</label>
            <textarea
              id="contacto-mensaje"
              name="mensaje"
              required
              rows="5"
              bind:value={form.mensaje}
              class="w-full px-4 py-3 rounded-xl border resize-y transition-colors duration-500 {effectiveLight ? 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-brand-magenta focus:ring-2 focus:ring-brand-magenta/20' : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-azul focus:ring-2 focus:ring-azul/20'}"
              placeholder="Cuéntanos en qué podemos ayudarte..."
            ></textarea>
          </div>
          {#if errorMessage}
            <p class="mb-4 text-sm font-medium text-red-600 dark:text-red-400" role="alert">
              {errorMessage}
            </p>
          {/if}
          <button
            type="submit"
            disabled={sending}
            class="btn-cta-animated micro-active-press relative inline-block overflow-hidden w-full sm:w-auto px-10 py-4 rounded-full text-base font-bold text-white transition-all duration-300 disabled:opacity-60 hover:scale-105 {effectiveLight ? 'bg-gradient-to-r from-brand-magenta to-brand-fuchsia' : 'bg-azul'}"
            style={ctaHovered && !sending ? (effectiveLight ? 'box-shadow: 0 0 50px #DE3B8490, 0 0 100px #D6007D40' : 'box-shadow: 0 0 50px #0070f390, 0 0 100px #0070f340') : ''}
            onmouseenter={onBtnEnter}
            onmouseleave={onBtnLeave}
          >
            <span class="invisible whitespace-nowrap">{sending ? 'Enviando...' : 'Enviar mensaje'}</span>
            <span bind:this={primaryRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(0%)">{sending ? 'Enviando...' : 'Enviar mensaje'}</span>
            <span bind:this={cloneRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(-110%)">{sending ? 'Enviando...' : 'Enviar mensaje'}</span>
          </button>
        </form>
      {/if}
    </FadeIn>
  </div>
</section>
