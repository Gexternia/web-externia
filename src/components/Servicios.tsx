/**
 * Servicios.tsx — Full services page for Externia.
 * Includes: FlickCards slider, all QuienesSomos visual effects.
 */
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import type { PanInfo } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// ── Global mouse tracker (shared RAF-batched singleton) ───────────
let _svMouseX = -9999, _svMouseY = -9999, _svMouseRaf = false, _svMouseInit = false;
const _svMouseSubs = new Set<(x: number, y: number) => void>();
function _ensureGlobalMouse() {
  if (_svMouseInit || typeof window === "undefined") return;
  _svMouseInit = true;
  window.addEventListener(
    "mousemove",
    (e) => {
      _svMouseX = e.clientX; _svMouseY = e.clientY;
      if (!_svMouseRaf) {
        _svMouseRaf = true;
        requestAnimationFrame(() => { _svMouseRaf = false; _svMouseSubs.forEach((fn) => fn(_svMouseX, _svMouseY)); });
      }
    },
    { passive: true }
  );
}

// ── Bubble background (same as QuienesSomos) ─────────────────────
type BubbleData = { x: number; y: number; r: number; vx: number; vy: number; baseVy: number; opacity: number; phase: number };

function BubblesBg({ isLight }: { isLight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const bubblesRef = useRef<BubbleData[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const W = canvas.width, H = canvas.height, N = 20;
    bubblesRef.current = Array.from({ length: N }, (_, i) => {
      const baseVy = -(0.3 + (i * 0.14) % 0.7);
      return { x: (i * (W / N) + 18) % W, y: (i * 97.3) % H, r: 14 + (i * 18.9) % 54, vx: (i % 2 === 0 ? 1 : -1) * ((i * 0.11) % 0.22), vy: baseVy, baseVy, opacity: 0.48 + (i * 0.021) % 0.32, phase: (i * 0.68) % (Math.PI * 2) };
    });
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(rafRef.current); };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const [cr, cg, cb] = isLight ? [222, 59, 132] : [40, 120, 255];
    const tick = () => {
      if (!canvas.width || !canvas.height) { rafRef.current = requestAnimationFrame(tick); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;
      const t = Date.now() * 0.001;
      for (const b of bubblesRef.current) {
        const dx = b.x - mx, dy = b.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelR = 150;
        if (dist < repelR && dist > 1) { const f = ((repelR - dist) / repelR) * 1.4; b.vx += (dx / dist) * f; b.vy += (dy / dist) * f; }
        b.vx *= 0.94; b.vy = b.vy * 0.95 + b.baseVy * 0.05;
        b.x += b.vx + Math.sin(t * 0.38 + b.phase) * 0.28; b.y += b.vy;
        if (b.y + b.r < 0) { b.y = canvas.height + b.r; b.x = Math.random() * canvas.width; b.vx = (Math.random() - 0.5) * 0.2; b.vy = b.baseVy; }
        if (b.x < -b.r) b.x = canvas.width + b.r;
        if (b.x > canvas.width + b.r) b.x = -b.r;
        const proximity = Math.max(0, 1 - dist / repelR);
        const glow = b.opacity + proximity * 0.45;
        const fill = ctx.createRadialGradient(b.x - b.r * 0.28, b.y - b.r * 0.28, 0, b.x, b.y, b.r);
        fill.addColorStop(0, `rgba(${cr},${cg},${cb},${glow * 0.09})`);
        fill.addColorStop(0.55, `rgba(${cr},${cg},${cb},${glow * 0.04})`);
        fill.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
        if (proximity > 0.04) {
          const halo = ctx.createRadialGradient(b.x, b.y, b.r * 0.85, b.x, b.y, b.r * 1.7);
          halo.addColorStop(0, `rgba(${cr},${cg},${cb},${proximity * 0.18})`);
          halo.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 1.7, 0, Math.PI * 2); ctx.fillStyle = halo; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${Math.min(0.72, glow * 0.82)})`; ctx.lineWidth = 1.2 + proximity * 1.2; ctx.stroke();
        const hl = ctx.createRadialGradient(b.x - b.r * 0.34, b.y - b.r * 0.34, 0, b.x - b.r * 0.34, b.y - b.r * 0.34, b.r * 0.34);
        hl.addColorStop(0, `rgba(255,255,255,${0.55 + proximity * 0.3})`); hl.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath(); ctx.arc(b.x - b.r * 0.34, b.y - b.r * 0.34, b.r * 0.34, 0, Math.PI * 2); ctx.fillStyle = hl; ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isLight]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 30, pointerEvents: "none" }} />;
}

// ── NetworkParticlesBg ────────────────────────────────────────────
function NetworkParticlesBg({ isLight }: { isLight: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => { await loadSlim(engine); }).then(() => setReady(true));
  }, []);
  if (!ready) return null;
  const accent = isLight ? "#DE3B84" : "#0070f3";
  return (
    <Particles
      id="sv-network"
      style={{ position: "fixed", inset: 0, zIndex: 5, pointerEvents: "none" }}
      options={{
        fpsLimit: 40,
        background: { color: { value: "transparent" } },
        interactivity: {
          detectsOn: "window" as const,
          events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: true, mode: "push" } },
          modes: { repulse: { distance: 100, duration: 0.4, factor: 3 }, push: { quantity: 1 } },
        },
        particles: {
          color: { value: accent },
          links: { enable: true, color: accent, opacity: isLight ? 0.58 : 1.0, distance: 130, width: 1.8 },
          move: { enable: true, speed: 0.6, random: true, direction: "none" as const, outModes: { default: "bounce" as const } },
          number: { density: { enable: true, area: 900 }, value: 50 },
          opacity: { value: { min: isLight ? 0.49 : 0.65, max: isLight ? 0.75 : 1.0 } },
          size: { value: { min: 2.5, max: 4 } },
          shape: { type: "circle" },
        },
        detectRetina: false,
      }}
    />
  );
}

// ── Theme hook ────────────────────────────────────────────────────
function useTheme() {
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
    const handler = (e: Event) => setIsLight(!(e as CustomEvent).detail.isDark);
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);
  return isLight;
}

// ── FadeIn ────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "", from = "bottom" }: {
  children: React.ReactNode; delay?: number; className?: string;
  from?: "bottom" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const init = from === "left" ? { opacity: 0, x: -50 } : from === "right" ? { opacity: 0, x: 50 } : { opacity: 0, y: 45 };
  return (
    <motion.div ref={ref} initial={init}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

// ── SectionLabel ──────────────────────────────────────────────────
function SectionLabel({ text, isLight, white = false }: { text: string; isLight: boolean; white?: boolean }) {
  if (white) return <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-white/20 text-white">{text}</span>;
  return (
    <span className={`inline-block px-5 py-2 rounded-full text-base font-bold tracking-widest uppercase mb-4 transition-colors duration-500 ${isLight ? "bg-brand-magenta/10 text-brand-magenta" : "bg-azul/10 text-azul"}`}>
      {text}
    </span>
  );
}

// ── Section backgrounds ───────────────────────────────────────────
const lightBg = "bg-white/65 backdrop-blur-[2px]";
const lightAltBg = "bg-gray-50/65 backdrop-blur-[2px]";
const darkBg = "bg-[#060d1a]/72 backdrop-blur-[2px]";
const darkAltBg = "bg-[#08111e]/72 backdrop-blur-[2px]";
function sectionBg(isLight: boolean, alt = false) {
  return isLight ? (alt ? lightAltBg : lightBg) : (alt ? darkAltBg : darkBg);
}

// ── SlideButton — same text-slide animation as QuienesSomos CTA ──
function SlideButton({ href, label, isLight, icon }: { href: string; label: string; isLight: boolean; icon: string }) {
  const [hovered, setHovered] = useState(false);
  const primaryRef = useRef<HTMLSpanElement>(null);
  const cloneRef = useRef<HTMLSpanElement>(null);
  const TR = "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)";

  const onEnter = () => {
    setHovered(true);
    if (!primaryRef.current || !cloneRef.current) return;
    primaryRef.current.style.transition = "none";
    primaryRef.current.style.transform = "translateX(0%)";
    cloneRef.current.style.transition = "none";
    cloneRef.current.style.transform = "translateX(-110%)";
    primaryRef.current.getBoundingClientRect();
    primaryRef.current.style.transition = TR;
    primaryRef.current.style.transform = "translateX(110%)";
    cloneRef.current.style.transition = TR;
    cloneRef.current.style.transform = "translateX(0%)";
  };

  const onLeave = () => {
    setHovered(false);
    if (!primaryRef.current || !cloneRef.current) return;
    primaryRef.current.style.transition = "none";
    primaryRef.current.style.transform = "translateX(-110%)";
    cloneRef.current.style.transition = "none";
    cloneRef.current.style.transform = "translateX(0%)";
    cloneRef.current.getBoundingClientRect();
    cloneRef.current.style.transition = TR;
    cloneRef.current.style.transform = "translateX(110%)";
    primaryRef.current.style.transition = TR;
    primaryRef.current.style.transform = "translateX(0%)";
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const text = `${icon} ${label}`;

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      whileTap={{ scale: 0.96 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative inline-block overflow-hidden px-6 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 ${
        isLight
          ? "border-brand-magenta/30 text-brand-magenta bg-brand-magenta/5 hover:bg-brand-magenta/12 hover:border-brand-magenta/60"
          : "border-azul/30 text-azul bg-azul/5 hover:bg-azul/12 hover:border-azul/60"
      }`}
      style={hovered ? { boxShadow: isLight ? "0 0 20px #DE3B8430" : "0 0 20px #0070f330" } : {}}
    >
      <span className="invisible whitespace-nowrap">{text}</span>
      <span ref={primaryRef} aria-hidden className="absolute inset-0 flex items-center justify-center whitespace-nowrap" style={{ transform: "translateX(0%)" }}>{text}</span>
      <span ref={cloneRef} aria-hidden className="absolute inset-0 flex items-center justify-center whitespace-nowrap" style={{ transform: "translateX(-110%)" }}>{text}</span>
    </motion.a>
  );
}

// ── MagneticRepel ─────────────────────────────────────────────────
function MagneticRepel({ children, strength = 52, radius = 185 }: { children: React.ReactNode; strength?: number; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 18 });
  const sy = useSpring(y, { stiffness: 160, damping: 18 });
  useEffect(() => {
    _ensureGlobalMouse();
    const cb = (mx: number, my: number) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = mx - (r.left + r.width * 0.5), dy = my - (r.top + r.height * 0.5);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius && dist > 0) { const f = (1 - dist / radius) * strength; x.set((-dx / dist) * f); y.set((-dy / dist) * f); }
      else { x.set(0); y.set(0); }
    };
    _svMouseSubs.add(cb);
    return () => { _svMouseSubs.delete(cb); };
  }, [strength, radius]);
  return <motion.div ref={ref} style={{ x: sx, y: sy }}>{children}</motion.div>;
}

// ── MagneticAttract ───────────────────────────────────────────────
function MagneticAttract({ children, strength = 14, radius = 75 }: { children: React.ReactNode; strength?: number; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });
  useEffect(() => {
    _ensureGlobalMouse();
    const cb = (mx: number, my: number) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = mx - (r.left + r.width * 0.5), dy = my - (r.top + r.height * 0.5);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius && dist > 0) { const f = (1 - dist / radius) * strength; x.set((dx / dist) * f); y.set((dy / dist) * f); }
      else { x.set(0); y.set(0); }
    };
    _svMouseSubs.add(cb);
    return () => { _svMouseSubs.delete(cb); };
  }, [strength, radius]);
  return <motion.div ref={ref} style={{ x: sx, y: sy, display: "inline-block" }}>{children}</motion.div>;
}

// ════════════════════════════════════════════════════════
// FLICK CARDS SLIDER
// ════════════════════════════════════════════════════════
type FlickCardData = {
  emoji: string;
  category: string;
  title: string;
  desc: string;
  ideal: string;
  gradientLight: string;
  gradientDark: string;
};

const ACTIVATION_CARDS: FlickCardData[] = [
  { emoji: "🖌️", category: "Transformación Creativa", title: "Smart Brush", desc: "El asistente dibuja sobre una tableta y la IA transforma su trazo en una creación artística de alta calidad en tiempo real. Creatividad humana e inteligencia artificial fusionadas.", ideal: "Stands en ferias, networking corporativo, lanzamientos de producto", gradientLight: "from-[#DE3B84] via-[#D6007D] to-[#a8005f]", gradientDark: "from-[#0070f3] via-[#0050c8] to-[#003a99]" },
  { emoji: "📡", category: "Transformación Creativa", title: "Smart Brush Live", desc: "Versión amplificada del Smart Brush diseñada para grandes audiencias. Las creaciones se proyectan en pantalla gigante en tiempo real, generando un efecto de galería colectiva.", ideal: "Conferencias, gala dinners, keynotes, espacios de gran afluencia", gradientLight: "from-[#D6007D] via-[#c0006e] to-[#8a004f]", gradientDark: "from-[#0060d0] via-[#0048b0] to-[#003080]" },
  { emoji: "🎨", category: "Transformación Creativa", title: "Sorolla Brush", desc: "Los bocetos de los asistentes se transforman en obras al estilo del pintor valenciano Joaquín Sorolla. Un recuerdo de alto valor artístico y una conexión única con el patrimonio español.", ideal: "Eventos institucionales, patrocinios culturales, marcas premium y de lujo", gradientLight: "from-[#FFC12D] via-[#F7A361] to-[#e08040]", gradientDark: "from-[#1a4fa8] via-[#1040a0] to-[#0a2878]" },
  { emoji: "🔮", category: "Entretenimiento Personalizado", title: "Mystic Oracle", desc: "Una 'pitonisa digital' que analiza la imagen de la palma de la mano mediante visión artificial y genera una predicción personalizada del futuro. Misterio, diversión y tecnología.", ideal: "Activaciones de marca, eventos temáticos, inauguraciones, cenas de gala", gradientLight: "from-[#EE847B] via-[#DE3B84] to-[#b02060]", gradientDark: "from-[#2860c0] via-[#1850a8] to-[#083890]" },
  { emoji: "😄", category: "Entretenimiento Personalizado", title: "Carizaturízame", desc: "La IA redefine el arte de la caricatura: genera retratos humorísticos e hiperpersonalizados de cada asistente en segundos. Alta capacidad: más de 2.300 caricaturas en un solo evento.", ideal: "Ferias, eventos masivos, stands con alto tráfico de visitantes", gradientLight: "from-[#DE3B84] via-[#EE847B] to-[#F7A361]", gradientDark: "from-[#0070f3] via-[#1a60d0] to-[#3050b0]" },
  { emoji: "🐼", category: "Entretenimiento Personalizado", title: "Pandarízate", desc: "Una activación lúdica y altamente compartible que transforma a los asistentes en adorables personajes panda o integra este universo visual en el entorno del evento. Resultados virales garantizados.", ideal: "Teambuilding, lanzamientos desenfadados, activaciones para redes sociales", gradientLight: "from-[#F7A361] via-[#EE847B] to-[#DE3B84]", gradientDark: "from-[#1858c0] via-[#0c48a8] to-[#063890]" },
  { emoji: "👗", category: "Identidad y Estilo", title: "Look A Like", desc: "Un sistema de IA que analiza el estilo del asistente y lo compara con una base de datos de tendencias de moda, generando una visualización personalizada de distintos estilos.", ideal: "Eventos de marcas de moda, retail, grandes almacenes, lifestyle", gradientLight: "from-[#D6007D] via-[#DE3B84] to-[#EE847B]", gradientDark: "from-[#004fc0] via-[#0060d0] to-[#1070e0]" },
  { emoji: "🤖", category: "Identidad y Estilo", title: "Avatar Motion", desc: "Transformamos a cada asistente en un avatar digital personalizado que captura su esencia y le proporciona una identidad única para la experiencia del evento. Tecnología de vanguardia.", ideal: "Eventos tecnológicos, lanzamientos de producto, mundos de marca inmersivos", gradientLight: "from-[#DE3B84] via-[#D6007D] to-[#FFC12D]", gradientDark: "from-[#0070f3] via-[#0068e0] to-[#3088ff]" },
];

// ════════════════════════════════════════════════════════
// WHEEL CAROUSEL — physics momentum, 3 visible, title bar
// ════════════════════════════════════════════════════════
// ── card layout constants (25% bigger than before) ──────────────
const CARD_W = 600;
const CARD_H = 630;
const X_SPREAD = 760;   // gap wide enough so side cards don't cover center
const ROT_DEG = 18;
const Y_ARC = 180;
const SCALE_OFF = 0.17;
const FRICTION = 0.88;
const PX_PER_CARD = 260;

// Wraps pos into [-n/2, n/2) so the carousel is infinite
function wrappedPos(rawPos: number, n: number): number {
  return ((rawPos + n / 2) % n + n) % n - n / 2;
}

function cardStyle(pos: number): React.CSSProperties {
  const abs = Math.abs(pos);
  return {
    width: CARD_W,
    height: CARD_H,
    position: "absolute",
    left: `calc(50% - ${CARD_W / 2}px)`,
    top: 30,
    borderRadius: 24,
    overflow: "hidden",
    pointerEvents: "none",
    zIndex: Math.round(30 - abs * 8),
    transform: `translateX(${pos * X_SPREAD}px) translateY(${abs * abs * Y_ARC}px) rotate(${pos * ROT_DEG}deg) scale(${Math.max(0.55, 1 - abs * SCALE_OFF)})`,
    opacity: abs > 1.7 ? 0 : Math.max(0.4, 1 - abs * 0.45),
    willChange: "transform, opacity",
  };
}

function WheelCarousel({ cards, isLight }: { cards: FlickCardData[]; isLight: boolean }) {
  const n = cards.length;
  const [offset, setOffset] = useState(0); // unbounded float — infinite rotation
  const offsetRef = useRef(0);
  const startOffsetRef = useRef(0);
  const dragStartX = useRef(0);
  const lastX = useRef(0);
  const lastT = useRef(0);
  const dragVel = useRef(0);
  const isDragging = useRef(false);
  const rafRef = useRef(0);

  const sync = (v: number) => { offsetRef.current = v; setOffset(v); };

  // Snap to nearest integer (no clamping — infinite)
  const snapTo = (from: number) => {
    const target = Math.round(from);
    let cur = from;
    const run = () => {
      cur += (target - cur) * 0.2;
      if (Math.abs(cur - target) < 0.003) { sync(target); return; }
      sync(cur);
      rafRef.current = requestAnimationFrame(run);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(run);
  };

  // Physics momentum — no bounds (infinite loop)
  const applyMomentum = (velCards: number, from: number) => {
    let vel = velCards;
    let cur = from;
    const run = () => {
      vel *= FRICTION;
      cur += vel;
      sync(cur);
      if (Math.abs(vel) > 0.01) {
        rafRef.current = requestAnimationFrame(run);
      } else {
        snapTo(cur);
      }
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(run);
  };

  // Jump to exact card index via nearest path (respects wrap-around)
  const jumpTo = (idx: number) => {
    cancelAnimationFrame(rafRef.current);
    const diff = wrappedPos(idx - offsetRef.current, n);
    const target = offsetRef.current + diff;
    let cur = offsetRef.current;
    const run = () => {
      cur += (target - cur) * 0.18;
      if (Math.abs(cur - target) < 0.003) { sync(target); return; }
      sync(cur);
      rafRef.current = requestAnimationFrame(run);
    };
    rafRef.current = requestAnimationFrame(run);
  };

  const onDown = (e: React.PointerEvent) => {
    cancelAnimationFrame(rafRef.current);
    isDragging.current = true;
    startOffsetRef.current = offsetRef.current;
    dragStartX.current = e.clientX;
    lastX.current = e.clientX;
    lastT.current = performance.now();
    dragVel.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const now = performance.now();
    const dt = now - lastT.current;
    if (dt > 0) dragVel.current = (e.clientX - lastX.current) / dt;
    lastX.current = e.clientX;
    lastT.current = now;
    // No clamping — free infinite spin
    sync(startOffsetRef.current - (e.clientX - dragStartX.current) / PX_PER_CARD);
  };

  const onUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const velCards = -(dragVel.current * (1000 / 60)) / PX_PER_CARD;
    Math.abs(velCards) > 0.08 ? applyMomentum(velCards, offsetRef.current) : snapTo(offsetRef.current);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  // Which real card sits at the center slot right now
  const centeredIdx = (((Math.round(offset) % n) + n) % n);
  const current = cards[centeredIdx];

  return (
    <div className="flex flex-col items-center gap-6 select-none w-full">

      {/* ── Title tabs ── */}
      <div className="flex flex-wrap justify-center gap-2 px-4 max-w-3xl">
        {cards.map((card, i) => (
          <motion.button
            key={i}
            onClick={() => jumpTo(i)}
            animate={{ opacity: i === centeredIdx ? 1 : 0.4, scale: i === centeredIdx ? 1 : 0.93 }}
            whileHover={{ opacity: 0.8 }}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors duration-200 ${
              i === centeredIdx
                ? isLight ? "bg-brand-magenta text-white border-brand-magenta" : "bg-azul text-white border-azul"
                : isLight ? "bg-white/60 text-gray-600 border-gray-200" : "bg-white/5 text-gray-400 border-white/10"
            }`}
          >
            {card.emoji} {card.title}
          </motion.button>
        ))}
      </div>

      {/* ── Category label ── */}
      <AnimatePresence mode="wait">
        <motion.p
          key={current.title}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className={`text-xs font-bold tracking-widest uppercase ${isLight ? "text-brand-magenta" : "text-azul"}`}
        >
          {current.category}
        </motion.p>
      </AnimatePresence>

      {/* ── Wheel ── */}
      <div
        className="relative w-full overflow-visible cursor-grab active:cursor-grabbing touch-none"
        style={{ height: CARD_H + 220 }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {cards.map((card, i) => {
          // Compute wrapped position so the carousel loops infinitely
          const pos = wrappedPos(i - offset, n);
          return (
            <div key={i} style={cardStyle(pos)}>
              <div className={`h-full flex flex-col justify-between p-8 bg-gradient-to-br ${isLight ? card.gradientLight : card.gradientDark}`}>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-5 bg-white/20 text-white">
                    {card.category}
                  </span>
                  <div className="text-7xl mb-5">{card.emoji}</div>
                  <h3 className="text-2xl font-black text-white mb-3">{card.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{card.desc}</p>
                </div>
                <div>
                  <div className="h-px bg-white/20 mb-4" />
                  <p className="text-white/80 text-xs leading-relaxed">
                    <span className="font-bold text-white">Ideal para:</span> {card.ideal}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 1 — HERO
// ════════════════════════════════════════════════════════
function HeroSection({ isLight }: { isLight: boolean }) {
  return (
    <section className={`relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-4 text-center transition-colors duration-500 ${sectionBg(isLight)}`}>
      <div className={`absolute top-1/4 -left-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none ${isLight ? "bg-brand-magenta" : "bg-azul"}`} />
      <div className={`absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none ${isLight ? "bg-brand-yellow" : "bg-blue-900"}`} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        className="relative z-10 mb-6">
        <SectionLabel text="Nuestros Servicios" isLight={isLight} />
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight max-w-5xl transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
        Experiencias de{" "}
        <span className={isLight
          ? "bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-brand-orange bg-clip-text text-transparent"
          : "bg-gradient-to-r from-[#0070f3] via-blue-300 to-[#0070f3] bg-clip-text text-transparent"}>
          IA
        </span>
        <br />que impactan
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className={`relative z-10 mt-6 text-lg sm:text-xl max-w-2xl leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-300"}`}>
        Activaciones experienciales, consultoría estratégica y formación especializada —
        todo bajo la filosofía <strong>MAPI</strong>: Medible, Asequible, Personalizado e Innovador.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="relative z-10 mt-10 flex flex-wrap justify-center gap-4">
        <SlideButton href="#activaciones" label="Activaciones" icon="🎯" isLight={isLight} />
        <SlideButton href="#consultoria" label="Consultoría" icon="🧠" isLight={isLight} />
        <SlideButton href="#formacion" label="Formación" icon="📚" isLight={isLight} />
      </motion.div>

    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 2 — ACTIVACIONES (FLICK CARDS)
// ════════════════════════════════════════════════════════
function ActivacionesSection({ isLight }: { isLight: boolean }) {
  return (
    <section id="activaciones" className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight, true)}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-20">
          <SectionLabel text="01 · Activaciones de IA Experiencial" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Instalaciones que{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              sorprenden
            </span>
          </h2>
          <p className={`mt-2 text-base max-w-xl mx-auto transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            8 activaciones interactivas agrupadas en 3 líneas temáticas. Arrastra las tarjetas para explorarlas.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <WheelCarousel cards={ACTIVATION_CARDS} isLight={isLight} />
        </FadeIn>

        {/* Category legend */}
        <FadeIn delay={0.35} className="mt-24 flex flex-wrap justify-center gap-6">
          {[
            { icon: "🖌️", label: "Transformación Creativa", count: 3 },
            { icon: "🎭", label: "Entretenimiento Personalizado", count: 3 },
            { icon: "👗", label: "Identidad y Estilo", count: 2 },
          ].map((cat) => (
            <div key={cat.label} className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-colors duration-500 ${isLight ? "bg-white/80 border-gray-100" : "bg-[#0d1829]/80 border-white/8"}`}>
              <span className="text-xl">{cat.icon}</span>
              <div>
                <p className={`text-xs font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{cat.label}</p>
                <p className={`text-xs ${isLight ? "text-gray-400" : "text-gray-500"}`}>{cat.count} activaciones</p>
              </div>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 3 — CONSULTORÍA
// ════════════════════════════════════════════════════════
function ConsultoriaSection({ isLight }: { isLight: boolean }) {
  const phases = [
    { num: "01", title: "CRE-IA-tividad", icon: "💡", desc: "Exploración del contexto del evento, los objetivos de la marca y el perfil de los asistentes. Co-creación de la solución más adecuada mediante brainstorming aumentado con IA.", color: isLight ? "#DE3B84" : "#0070f3" },
    { num: "02", title: "AI-mplementación", icon: "⚙️", desc: "Desarrollo e integración ágil de la solución elegida. La tecnología se adapta perfectamente al espacio, el tiempo disponible y el equipo humano del evento.", color: isLight ? "#FFC12D" : "#3b82f6" },
    { num: "03", title: "Evolución y Optimización", icon: "📊", desc: "Monitorización en tiempo real, recogida de feedback y generación de informes de impacto medibles. También ofrecemos auditorías de IA y asesoramiento en la Ley de IA de la UE.", color: isLight ? "#F7A361" : "#60a5fa" },
  ];

  const extras = [
    { icon: "🔍", label: "Auditorías de IA" },
    { icon: "🗺️", label: "Hojas de ruta tecnológicas" },
    { icon: "⚖️", label: "Cumplimiento Ley IA UE" },
    { icon: "🌱", label: "Soluciones neutras en carbono" },
  ];

  return (
    <section id="consultoria" className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight)}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-20">
          <SectionLabel text="02 · Consultoría Estratégica de IA" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Integración real,{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta to-brand-orange bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              no genérica
            </span>
          </h2>
          <p className={`mt-4 text-base max-w-xl mx-auto transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Diseñada específicamente para el sector de los eventos, con el conocimiento de quienes lo conocen desde dentro.
          </p>
        </FadeIn>

        <div className="relative">
          <div className={`hidden lg:block absolute top-10 left-[16.66%] right-[16.66%] h-px transition-colors duration-500 ${isLight ? "bg-gradient-to-r from-brand-magenta via-brand-yellow to-brand-orange" : "bg-gradient-to-r from-azul/40 to-blue-400/40"}`} />
          <div className="grid lg:grid-cols-3 gap-10">
            {phases.map((phase, i) => (
              <MagneticRepel key={i} strength={40} radius={160}>
                <FadeIn delay={i * 0.15}>
                  <div className={`flex flex-col items-center text-center p-8 rounded-2xl border transition-all duration-300 ${isLight ? "bg-white/90 border-gray-100 backdrop-blur-sm" : "bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/40 backdrop-blur-sm"}`}>
                    <motion.div whileHover={{ scale: 1.12 }} transition={{ type: "spring", stiffness: 300 }}
                      className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white mb-6 shadow-xl"
                      style={{ backgroundColor: phase.color }}>
                      <MagneticAttract strength={16} radius={65}>
                        <span>{phase.num}</span>
                      </MagneticAttract>
                      <div className="absolute inset-0 rounded-full opacity-40 blur-md" style={{ backgroundColor: phase.color }} />
                    </motion.div>
                    <div className="text-3xl mb-3">{phase.icon}</div>
                    <h3 className={`text-xl font-black mb-3 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
                      {phase.title.split("-").map((part, pi, arr) =>
                        part === "IA" ? <span key={pi} style={{ color: phase.color }}>IA</span>
                          : <span key={pi}>{part}{pi < arr.length - 1 && "-"}</span>
                      )}
                    </h3>
                    <p className={`text-sm leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>{phase.desc}</p>
                  </div>
                </FadeIn>
              </MagneticRepel>
            ))}
          </div>
        </div>

        <FadeIn delay={0.3} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {extras.map((e) => (
            <div key={e.label} className={`flex items-center gap-3 p-4 rounded-2xl border transition-colors duration-500 ${isLight ? "bg-white/80 border-gray-100" : "bg-[#0d1829]/60 border-white/8"}`}>
              <MagneticAttract strength={14} radius={55}>
                <span className="text-2xl">{e.icon}</span>
              </MagneticAttract>
              <span className={`text-sm font-semibold transition-colors duration-500 ${isLight ? "text-gray-700" : "text-gray-300"}`}>{e.label}</span>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 4 — FORMACIÓN
// ════════════════════════════════════════════════════════
function FormacionSection({ isLight }: { isLight: boolean }) {
  const programs = [
    { icon: "🌱", title: "Taller Introductorio", level: "Nivel básico", desc: "Para equipos que quieren empezar a usar la IA de forma práctica y rápida en su día a día. Resultados visibles desde la primera sesión.", gradient: isLight ? "from-[#DE3B84]/8 to-[#FFC12D]/4" : "", hoverLight: "hover:border-[#DE3B84]/50" },
    { icon: "🚀", title: "Programa Avanzado", level: "Nivel estratégico", desc: "Para profesionales que buscan una visión completa: herramientas, flujos de trabajo, casos de uso reales y aplicación directa al negocio de eventos.", gradient: isLight ? "from-[#FFC12D]/8 to-[#F7A361]/4" : "", hoverLight: "hover:border-[#FFC12D]/50" },
    { icon: "🎯", title: "Formación a Medida", level: "Personalizado", desc: "Diseñamos programas específicos para agencias o departamentos con necesidades concretas, incluyendo formatos presenciales, online e híbridos.", gradient: isLight ? "from-[#F7A361]/8 to-[#EE847B]/4" : "", hoverLight: "hover:border-[#F7A361]/50" },
  ];

  return (
    <section id="formacion" className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight, true)}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <SectionLabel text="03 · Formación Especializada" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            IA aplicada al{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-fuchsia to-brand-magenta bg-clip-text text-transparent"
              : "bg-gradient-to-r from-blue-300 to-azul bg-clip-text text-transparent"}>
              sector MICE
            </span>
          </h2>
          <p className={`mt-4 text-base max-w-xl mx-auto transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            No enseñamos IA genérica. Enseñamos IA aplicada a las necesidades de quienes organizan, producen y venden eventos.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <MagneticRepel key={i} strength={45} radius={175}>
              <FadeIn delay={i * 0.12}>
                <div className={`h-full p-7 rounded-2xl border transition-all duration-300 cursor-default ${isLight
                  ? `bg-gradient-to-br ${p.gradient} bg-white/90 border-gray-100 ${p.hoverLight} backdrop-blur-sm`
                  : "bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/45 hover:bg-[#00c8ff]/6 backdrop-blur-sm"}`}>
                  <MagneticAttract strength={18} radius={70}>
                    <div className="text-4xl mb-5">{p.icon}</div>
                  </MagneticAttract>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 transition-colors duration-500 ${isLight ? "bg-brand-magenta/10 text-brand-magenta" : "bg-azul/10 text-azul"}`}>
                    {p.level}
                  </div>
                  <h3 className={`text-lg font-black mb-3 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>{p.title}</h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>{p.desc}</p>
                </div>
              </FadeIn>
            </MagneticRepel>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 5 — PARA QUIÉN
// ════════════════════════════════════════════════════════
function ParaQuienSection({ isLight }: { isLight: boolean }) {
  const types = [
    { icon: "🏷️", title: "Activaciones de marca", desc: "Donde el objetivo es generar efecto WOW y conexión emocional entre los asistentes y la marca." },
    { icon: "🏢", title: "Eventos corporativos", desc: "Para enriquecer momentos de networking, entretener en cenas de gala y crear oportunidades de patrocinio únicas." },
    { icon: "🎪", title: "Ferias y congresos", desc: "Para atraer un alto volumen de visitantes, captar su atención y dejar una impresión duradera." },
    { icon: "🤝", title: "Teambuilding e incentivos", desc: "Activaciones lúdicas y participativas que refuerzan la cohesión de equipo y generan recuerdos compartidos." },
  ];

  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${
      isLight
        ? "bg-gradient-to-br from-[#f0a0c0] via-[#dc80c8] to-[#f8c090]"
        : "bg-[#060d1a]/95 backdrop-blur-sm"
    }`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <SectionLabel text="¿Para qué eventos?" isLight={isLight} white={isLight} />
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Diseñados para el{" "}
            <span className={isLight
              ? "text-white"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              impacto real
            </span>
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {types.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <MagneticRepel strength={38} radius={155}>
                <div className={`p-6 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 ${isLight ? "bg-white/15 border-white/25 backdrop-blur-sm hover:bg-white/25" : "bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/40 backdrop-blur-sm"}`}>
                  <MagneticAttract strength={16} radius={60}>
                    <div className="text-4xl mb-4">{t.icon}</div>
                  </MagneticAttract>
                  <h3 className="text-base font-black text-white mb-2">{t.title}</h3>
                  <p className={`text-xs leading-relaxed ${isLight ? "text-white/75" : "text-gray-400"}`}>{t.desc}</p>
                </div>
              </MagneticRepel>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 6 — CTA
// ════════════════════════════════════════════════════════
function CTASection({ isLight }: { isLight: boolean }) {
  const [hovered, setHovered] = useState(false);
  const primaryRef = useRef<HTMLSpanElement>(null);
  const cloneRef = useRef<HTMLSpanElement>(null);
  const TR = "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)";

  const onBtnEnter = () => {
    setHovered(true);
    if (!primaryRef.current || !cloneRef.current) return;
    primaryRef.current.style.transition = "none";
    primaryRef.current.style.transform = "translateX(0%)";
    cloneRef.current.style.transition = "none";
    cloneRef.current.style.transform = "translateX(-110%)";
    primaryRef.current.getBoundingClientRect();
    primaryRef.current.style.transition = TR;
    primaryRef.current.style.transform = "translateX(110%)";
    cloneRef.current.style.transition = TR;
    cloneRef.current.style.transform = "translateX(0%)";
  };

  const onBtnLeave = () => {
    setHovered(false);
    if (!primaryRef.current || !cloneRef.current) return;
    primaryRef.current.style.transition = "none";
    primaryRef.current.style.transform = "translateX(-110%)";
    cloneRef.current.style.transition = "none";
    cloneRef.current.style.transform = "translateX(0%)";
    cloneRef.current.getBoundingClientRect();
    cloneRef.current.style.transition = TR;
    cloneRef.current.style.transform = "translateX(110%)";
    primaryRef.current.style.transition = TR;
    primaryRef.current.style.transform = "translateX(0%)";
  };

  return (
    <section className={`relative py-32 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight)}`}>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-12 pointer-events-none transition-colors duration-500 ${isLight ? "bg-brand-magenta" : "bg-azul"}`} />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <FadeIn>
          <SectionLabel text="Diseñemos juntos" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Tu próxima experiencia{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-brand-orange bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul via-blue-300 to-azul bg-clip-text text-transparent"}>
              inolvidable
            </span>
          </h2>
          <p className={`text-lg mb-10 transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Cuéntanos tu evento y te proponemos la solución MAPI perfecta para él.
          </p>

          <motion.a href="mailto:g.prado@externia.ai" whileTap={{ scale: 0.97 }}
            onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}
            className={`relative inline-block overflow-hidden px-12 py-5 rounded-full text-lg font-bold text-white transition-shadow duration-300 ${isLight ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia" : "bg-azul"}`}
            style={hovered ? { boxShadow: isLight ? "0 0 50px #DE3B8490, 0 0 100px #D6007D40" : "0 0 50px #0070f390, 0 0 100px #0070f340" } : {}}>
            <span className="invisible whitespace-nowrap">Contactar ahora →</span>
            <span ref={primaryRef} aria-hidden
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
              style={{ transform: "translateX(0%)" }}>
              Contactar ahora →
            </span>
            <span ref={cloneRef} aria-hidden
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
              style={{ transform: "translateX(-110%)" }}>
              Contactar ahora →
            </span>
          </motion.a>

          <p className={`mt-6 text-sm transition-colors duration-500 ${isLight ? "text-gray-400" : "text-gray-500"}`}>
            g.prado@externia.ai · +34 648 264 949
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// ROOT EXPORT
// ════════════════════════════════════════════════════════
export default function Servicios() {
  const isLight = useTheme();

  return (
    <>
      <BubblesBg isLight={isLight} />
      <NetworkParticlesBg isLight={isLight} />
      <div className="relative z-10 transition-colors duration-500">
        <HeroSection isLight={isLight} />
        <ActivacionesSection isLight={isLight} />
        <ConsultoriaSection isLight={isLight} />
        <FormacionSection isLight={isLight} />
        <ParaQuienSection isLight={isLight} />
        <CTASection isLight={isLight} />
      </div>
    </>
  );
}
