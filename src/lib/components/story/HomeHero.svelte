<script lang="ts">
  import { onMount } from 'svelte';
  import './story.css';

  let section: HTMLElement;
  let canvas: HTMLCanvasElement;
  let ready = $state(false);

  const STOPS: [number, string][] = [[0, '#FFC12D'], [0.28, '#F7A361'], [0.55, '#EE847B'], [0.8, '#DE3B84'], [1, '#D6007D']];

  onMount(() => {
    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0, DPR = 1;
    let light = document.documentElement.classList.contains('light');

    type P = { x: number; y: number; vx: number; vy: number; hx: number; hy: number; c: string; s: number; dx: number; dy: number };
    let parts: P[] = [];
    type N = { x: number; y: number; vx: number; vy: number };
    let nodes: N[] = [];

    // pointer + scroll state
    let mx = -9999, my = -9999, scrollK = 0;
    let t0 = performance.now();
    let raf = 0, visible = true;

    /** Draw the lockup offscreen and sample it into particle targets */
    function build() {
      DPR = Math.min(devicePixelRatio || 1, 2);
      W = section.clientWidth; H = section.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';

      const mobile = W < 700;
      const logoW = Math.min(W * (mobile ? 0.92 : 0.66), 1040);
      const scale = logoW / 1003;
      const logoH = 278 * scale;
      const ox = (W - logoW) / 2, oy = H * (mobile ? 0.38 : 0.4) - logoH / 2;

      const off = document.createElement('canvas');
      off.width = Math.ceil(logoW); off.height = Math.ceil(logoH);
      const o = off.getContext('2d', { willReadFrequently: true })!;
      const g = o.createLinearGradient(0, 0, logoW, 0);
      STOPS.forEach(([p, c]) => g.addColorStop(p, c));
      o.fillStyle = g;
      o.save(); o.scale(scale, scale);
      o.translate(30, 32.72); o.scale(5.4464, 5.4464);
      o.fillRect(4, 7, 32, 5); o.fillRect(4, 17, 22, 5); o.fillRect(4, 27, 32, 5);
      o.beginPath(); o.arc(33, 19.5, 2.5, 0, Math.PI * 2); o.fill();
      o.restore();
      o.font = `800 ${200 * scale}px Montserrat, "Helvetica Neue", sans-serif`;
      o.textBaseline = 'alphabetic';
      o.fillText('xternia', 254 * scale, 192.4 * scale);

      const img = o.getImageData(0, 0, off.width, off.height).data;
      const gap = Math.max(3, Math.round(logoW / (mobile ? 120 : 230)));
      const old = parts;
      parts = [];
      let k = 0;
      for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
          const i = (y * off.width + x) * 4;
          if (img[i + 3] < 140) continue;
          const prev = old[k++];
          const ang = Math.random() * Math.PI * 2;
          parts.push({
            hx: ox + x, hy: oy + y,
            // start scattered on first build, keep position on resize
            x: prev ? prev.x : W / 2 + Math.cos(ang) * (W * 0.3 + Math.random() * W * 0.5),
            y: prev ? prev.y : H / 2 + Math.sin(ang) * (H * 0.3 + Math.random() * H * 0.5),
            vx: 0, vy: 0,
            c: `rgb(${img[i]},${img[i + 1]},${img[i + 2]})`,
            s: gap * (0.78 + Math.random() * 0.2),
            dx: Math.cos(ang), dy: Math.sin(ang)
          });
        }
      }
      // background network
      const count = mobile ? 26 : 54;
      nodes = Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25 }));
    }

    function frame(now: number) {
      raf = 0;
      if (!visible || document.hidden) return;
      const t = (now - t0) / 1000;
      const intro = Math.min(1, t / 2.2);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // network
      const lineRGB = light ? '214,0,125' : '255,95,168';
      const maxD = Math.min(170, W * 0.14);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < maxD) {
            ctx.strokeStyle = `rgba(${lineRGB},${(1 - d / maxD) * (light ? 0.18 : 0.22) * (1 - scrollK)})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      ctx.fillStyle = `rgba(${light ? '247,163,97' : '255,193,45'},${0.55 * (1 - scrollK)})`;
      for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2); ctx.fill(); }

      // logo particles
      const spring = 0.02 + intro * 0.05;
      const R = Math.max(70, W * 0.07), R2 = R * R;
      const blow = scrollK * scrollK * Math.max(W, H) * 0.9;
      ctx.globalAlpha = 1 - scrollK * 0.85;
      for (const p of parts) {
        const tx = p.hx + p.dx * blow + Math.sin(t * 1.3 + p.hy * 0.04) * 1.2;
        const ty = p.hy + p.dy * blow + Math.cos(t * 1.1 + p.hx * 0.04) * 1.2;
        p.vx += (tx - p.x) * spring;
        p.vy += (ty - p.y) * spring;
        const ddx = p.x - mx, ddy = p.y - my, d2 = ddx * ddx + ddy * ddy;
        if (d2 < R2) {
          const f = (1 - d2 / R2) * 7;
          const d = Math.sqrt(d2) || 1;
          p.vx += (ddx / d) * f; p.vy += (ddy / d) * f;
        }
        p.vx *= 0.82; p.vy *= 0.82;
        p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };

    const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const onLeave = () => { mx = my = -9999; };
    const onScroll = () => { scrollK = Math.min(1, Math.max(0, scrollY / (section.offsetHeight * 0.85))); };
    const onTheme = () => { light = document.documentElement.classList.contains('light'); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); });
    const ro = new ResizeObserver(() => { build(); kick(); });
    const onVis = () => kick();

    document.fonts.ready.then(() => {
      build();
      ro.observe(section);
      io.observe(section);
      t0 = performance.now();
      ready = true;
      kick();
    });
    section.addEventListener('pointermove', onMove);
    section.addEventListener('pointerleave', onLeave);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('themechange', onTheme);
    document.addEventListener('visibilitychange', onVis);
    onScroll();

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      removeEventListener('scroll', onScroll);
      removeEventListener('themechange', onTheme);
      document.removeEventListener('visibilitychange', onVis);
    };
  });
</script>

<section class="xs hhero" class:ready bind:this={section} aria-label="Externia">
  <canvas bind:this={canvas} aria-hidden="true"></canvas>
  <h1 class="sr-only">Externia — Consultoría de inteligencia artificial para eventos</h1>
  <div class="bottom">
    <p class="tag">Consultoría de <em>inteligencia artificial</em> para eventos</p>
    <div class="ctas">
      <a class="xs-btn" href="/servicios">Ver activaciones <span aria-hidden="true">→</span></a>
      <a class="xs-btn xs-btn--ghost" href="/contacto">Hablemos</a>
    </div>
  </div>
  <div class="cue" aria-hidden="true"><span></span></div>
</section>

<style>
  .hhero { position: relative; height: 100vh; height: 100svh; min-height: 560px; overflow: hidden; cursor: crosshair; }
  canvas { position: absolute; inset: 0; display: block; }
  .bottom { position: absolute; left: 0; right: 0; top: 62%; display: grid; justify-items: center; gap: 26px; padding: 0 16px; text-align: center; opacity: 0; transform: translateY(20px); transition: opacity 1s ease 1.6s, transform 1.2s var(--xs-ease) 1.6s; }
  .ready .bottom { opacity: 1; transform: none; }
  .tag { margin: 0; font-size: clamp(18px, 1.7vw, 26px); font-weight: 600; letter-spacing: -0.01em; color: var(--xs-muted); }
  .tag em { font-style: normal; color: var(--xs-pink-2); font-weight: 800; }
  .ctas { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; cursor: auto; }
  .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .cue { position: absolute; left: 50%; bottom: 28px; width: 1px; height: 52px; background: var(--xs-faint); overflow: hidden; }
  .cue span { position: absolute; left: 0; top: -40%; width: 1px; height: 40%; background: var(--xs-pink); animation: cue 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
  @keyframes cue { to { top: 110%; } }
  @media (max-width: 700px) {
    .bottom { top: 52%; }
    .ctas .xs-btn { padding: 15px 24px; font-size: 15px; }
  }
</style>
