<script lang="ts">
  /**
   * Contáctanos — usa el backend propio en `/api/contact` y permite override
   * con PUBLIC_CONTACT_FORM_URL si alguna vez se quiere externalizar.
   * The Externia "E" builds itself as the three required fields get filled.
   */
  import { env } from '$env/dynamic/public';
  import '$lib/components/story/story.css';

  let form = $state({ nombre: '', email: '', empresa: '', mensaje: '' });
  let sending = $state(false);
  let submitted = $state(false);
  let errorMessage = $state<string | null>(null);

  const okNombre = $derived(form.nombre.trim().length > 1);
  const okEmail = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()));
  const okMensaje = $derived(form.mensaje.trim().length > 9);
  const ready = $derived(okNombre && okEmail && okMensaje);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (sending || submitted) return;
    sending = true;
    errorMessage = null;
    const url = env.PUBLIC_CONTACT_FORM_URL || '/api/contact';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: form.nombre, email: form.email, empresa: form.empresa, mensaje: form.mensaje })
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

<div class="cf" id="formulario-contacto">
  <!-- progress: one bar per required field, the dot when ready -->
  <div class="E" aria-hidden="true">
    <span class="bar" class:on={okNombre}><i></i></span>
    <span class="bar short" class:on={okEmail}><i></i></span>
    <span class="bar" class:on={okMensaje}><i></i></span>
    <span class="dot" class:on={ready || submitted}></span>
  </div>

  {#if submitted}
    <div class="done" role="status">
      <h3>Mensaje enviado</h3>
      <p>Gracias por contactar. Te responderemos pronto.</p>
      <button type="button" class="again" onclick={() => (submitted = false)}>Enviar otro mensaje</button>
    </div>
  {:else}
    <form onsubmit={handleSubmit}>
      <div class="field" class:ok={okNombre}>
        <input id="contacto-nombre" type="text" name="nombre" required autocomplete="name" placeholder=" " bind:value={form.nombre} />
        <label for="contacto-nombre">Nombre *</label>
        <span class="line" aria-hidden="true"></span>
      </div>
      <div class="field" class:ok={okEmail}>
        <input id="contacto-email" type="email" name="email" required autocomplete="email" placeholder=" " bind:value={form.email} />
        <label for="contacto-email">Email *</label>
        <span class="line" aria-hidden="true"></span>
      </div>
      <div class="field">
        <input id="contacto-empresa" type="text" name="empresa" autocomplete="organization" placeholder=" " bind:value={form.empresa} />
        <label for="contacto-empresa">Empresa <span class="opt">(opcional)</span></label>
        <span class="line" aria-hidden="true"></span>
      </div>
      <div class="field" class:ok={okMensaje}>
        <textarea id="contacto-mensaje" name="mensaje" required rows="4" placeholder=" " bind:value={form.mensaje}></textarea>
        <label for="contacto-mensaje">Cuéntanos tu evento *</label>
        <span class="line" aria-hidden="true"></span>
      </div>
      {#if errorMessage}<p class="err" role="alert">{errorMessage}</p>{/if}
      <div class="actions">
        <button type="submit" class="xs-btn" disabled={sending}>{sending ? 'Enviando…' : 'Enviar mensaje'} <span aria-hidden="true">→</span></button>
        <span class="hint">{ready ? 'Todo listo.' : 'Completa los campos con * y la E se ilumina.'}</span>
      </div>
    </form>
  {/if}
</div>

<style>
  .cf { position: relative; }
  .E { position: relative; width: 120px; aspect-ratio: 32 / 25; margin-bottom: 36px; }
  .bar { position: absolute; left: 0; height: 20%; width: 100%; border-radius: 3px; background: var(--xs-faint); overflow: hidden; }
  .bar:nth-child(1) { top: 0; }
  .bar:nth-child(2) { top: 40%; }
  .bar:nth-child(3) { top: 80%; }
  .bar.short { width: 68.75%; }
  .bar i { position: absolute; inset: 0; background: var(--xs-brand); transform-origin: left; transform: scaleX(0); transition: transform 0.8s var(--xs-ease); }
  .bar.on i { transform: scaleX(1); }
  .dot { position: absolute; right: 0; top: 40%; width: 15.6%; aspect-ratio: 1; border-radius: 50%; background: #d6007d; transform: translate(6%, 0) scale(0); transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .dot.on { transform: translate(6%, 0) scale(1); }

  form { display: grid; gap: 8px; }
  .field { position: relative; padding-top: 22px; }
  .field input, .field textarea {
    width: 100%; padding: 12px 0 14px; border: 0; border-bottom: 1.5px solid var(--xs-line); background: transparent; color: var(--xs-ink);
    font: inherit; font-size: clamp(18px, 1.6vw, 24px); font-weight: 600; letter-spacing: -0.01em; resize: vertical; caret-color: #de3b84; border-radius: 0;
  }
  .field input:focus, .field textarea:focus { outline: none; }
  .field label { position: absolute; left: 0; top: 34px; font-size: clamp(18px, 1.6vw, 24px); font-weight: 600; color: var(--xs-muted); pointer-events: none; transform-origin: left top; transition: transform 0.4s var(--xs-ease), color 0.3s; }
  .opt { font-weight: 500; opacity: 0.7; }
  .field input:focus + label, .field input:not(:placeholder-shown) + label,
  .field textarea:focus + label, .field textarea:not(:placeholder-shown) + label { transform: translateY(-30px) scale(0.6); color: var(--xs-pink-2); }
  .line { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: var(--xs-brand); transform: scaleX(0); transform-origin: left; transition: transform 0.6s var(--xs-ease); }
  .field input:focus ~ .line, .field textarea:focus ~ .line, .field.ok .line { transform: scaleX(1); }
  .field textarea ~ .line { bottom: 6px; }

  .err { margin: 8px 0 0; font-size: 15px; font-weight: 600; color: #ff5f7a; }
  :global(.light) .err { color: #c4002f; }
  .actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 28px; }
  .hint { font-size: 14px; color: var(--xs-muted); }

  .done { padding: 32px 0; }
  .done h3 { margin: 0; font-size: clamp(32px, 3.4vw, 52px); font-weight: 800; letter-spacing: -0.03em; }
  .done p { margin: 12px 0 0; font-size: 18px; color: var(--xs-muted); }
  .again { margin-top: 24px; padding: 0; border: 0; background: none; font: inherit; font-weight: 700; color: var(--xs-pink-2); cursor: pointer; border-bottom: 2px solid currentColor; }
</style>
