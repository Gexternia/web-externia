/**
 * Formacion.tsx — Formaciones en IA para Eventos. Mismo diseño que Quiénes Somos.
 * Fondo de burbujas, tema claro/oscuro, secciones con FadeIn y TiltCard.
 */
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── Interactive canvas bubbles background (mismo que Quiénes Somos) ──
type BubbleData = { x: number; y: number; r: number; vx: number; vy: number; baseVy: number; opacity: number; phase: number };

function BubblesBg({ isLight }: { isLight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const bubblesRef = useRef<BubbleData[]>([]);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const W = canvas.width, H = canvas.height, N = 30;
    bubblesRef.current = Array.from({ length: N }, (_, i) => ({
      x: (i * (W / N) + 18) % W,
      y: (i * 97.3) % H,
      r: 14 + (i * 18.9) % 54,
      vx: (i % 2 === 0 ? 1 : -1) * ((i * 0.11) % 0.22),
      vy: -(0.3 + (i * 0.14) % 0.7),
      baseVy: -(0.3 + (i * 0.14) % 0.7),
      opacity: 0.48 + (i * 0.021) % 0.32,
      phase: (i * 0.68) % (Math.PI * 2),
    }));
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
        if (dist < repelR && dist > 1) {
          const f = ((repelR - dist) / repelR) * 1.4;
          b.vx += (dx / dist) * f;
          b.vy += (dy / dist) * f;
        }
        b.vx *= 0.94;
        b.vy = b.vy * 0.95 + b.baseVy * 0.05;
        b.x += b.vx + Math.sin(t * 0.38 + b.phase) * 0.28;
        b.y += b.vy;
        if (b.y + b.r < 0) {
          b.y = canvas.height + b.r;
          b.x = Math.random() * canvas.width;
          b.vx = (Math.random() - 0.5) * 0.2;
          b.vy = b.baseVy;
        }
        if (b.x < -b.r) b.x = canvas.width + b.r;
        if (b.x > canvas.width + b.r) b.x = -b.r;
        const proximity = Math.max(0, 1 - dist / repelR);
        const glow = b.opacity + proximity * 0.45;
        const fill = ctx.createRadialGradient(b.x - b.r * 0.28, b.y - b.r * 0.28, 0, b.x, b.y, b.r);
        fill.addColorStop(0, `rgba(${cr},${cg},${cb},${glow * 0.09})`);
        fill.addColorStop(0.55, `rgba(${cr},${cg},${cb},${glow * 0.04})`);
        fill.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        if (proximity > 0.04) {
          const halo = ctx.createRadialGradient(b.x, b.y, b.r * 0.85, b.x, b.y, b.r * 1.7);
          halo.addColorStop(0, `rgba(${cr},${cg},${cb},${proximity * 0.18})`);
          halo.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r * 1.7, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${Math.min(0.72, glow * 0.82)})`;
        ctx.lineWidth = 1.2 + proximity * 1.2;
        ctx.stroke();
        const hl = ctx.createRadialGradient(b.x - b.r * 0.34, b.y - b.r * 0.34, 0, b.x - b.r * 0.34, b.y - b.r * 0.34, b.r * 0.34);
        hl.addColorStop(0, `rgba(255,255,255,${0.55 + proximity * 0.3})`);
        hl.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.34, b.y - b.r * 0.34, b.r * 0.34, 0, Math.PI * 2);
        ctx.fillStyle = hl;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 30, pointerEvents: "none" }}
    />
  );
}

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

function SectionLabel({ text, isLight, white = false }: { text: string; isLight: boolean; white?: boolean }) {
  if (white) return (
    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-white/20 text-white">{text}</span>
  );
  return (
    <span className={`inline-block px-5 py-2 rounded-full text-base font-bold tracking-widest uppercase mb-4 transition-colors duration-500 ${
      isLight ? "bg-brand-magenta/10 text-brand-magenta" : "bg-azul/10 text-azul"
    }`}>{text}</span>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const [s, setS] = useState({});
  const onMove = (e: React.MouseEvent) => {
    const r = el.current!.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -18;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 18;
    setS({ transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`, transition: "transform 0.12s ease" });
  };
  const onLeave = () => setS({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)", transition: "transform 0.5s ease" });
  return (
    <div ref={el} onMouseMove={onMove} onMouseLeave={onLeave} style={s} className={className}>{children}</div>
  );
}

const lightBg = "bg-white/88 backdrop-blur-[2px]";
const lightAltBg = "bg-gray-50/88 backdrop-blur-[2px]";
const darkBg = "bg-[#060d1a]/92 backdrop-blur-[2px]";
const darkAltBg = "bg-[#08111e]/92 backdrop-blur-[2px]";
function sectionBg(isLight: boolean, alt = false) {
  return isLight ? (alt ? lightAltBg : lightBg) : (alt ? darkAltBg : darkBg);
}

// ════════════════════════════════════════════════════════
// HERO
// ════════════════════════════════════════════════════════
function HeroSection({ isLight }: { isLight: boolean }) {
  return (
    <section className={`relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-4 text-center transition-colors duration-500 ${sectionBg(isLight)}`}>
      <div className={`absolute top-1/4 -left-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 ${isLight ? "bg-brand-magenta" : "bg-azul"}`} />
      <div className={`absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 ${isLight ? "bg-brand-yellow" : "bg-blue-900"}`} />

      <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight max-w-4xl transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
        Formaciones en{" "}
        <span className={isLight
          ? "bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-brand-orange bg-clip-text text-transparent"
          : "bg-gradient-to-r from-[#0070f3] via-blue-300 to-[#0070f3] bg-clip-text text-transparent"}>
          IA
        </span>{" "}
        para Eventos
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className={`relative z-10 mt-6 text-lg sm:text-xl max-w-2xl leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-300"}`}>
        Aprende IA aplicada al sector que conoces.
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
        className={`relative z-10 mt-3 text-sm uppercase tracking-widest font-semibold transition-colors duration-500 ${isLight ? "text-brand-magenta/80" : "text-azul/90"}`}>
        Presencial · Online · A medida
      </motion.p>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// ¿POR QUÉ FORMARSE CON EXTERNIA?
// ════════════════════════════════════════════════════════
function PorQueSection({ isLight }: { isLight: boolean }) {
  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight, true)}`}>
      <div className="max-w-4xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <SectionLabel text="¿Por qué formarse con Externia?" isLight={isLight} />
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black leading-tight transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            IA que entiende tu{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              sector
            </span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className={`text-base sm:text-lg leading-relaxed max-w-3xl transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-300"}`}>
            La inteligencia artificial ya está redefiniendo la industria de los eventos. Sin embargo, la mayoría de la formación en IA disponible es genérica, orientada a desarrolladores o desconectada de la realidad del sector MICE.
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className={`mt-5 text-base sm:text-lg leading-relaxed max-w-3xl transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-300"}`}>
            En Externia lo hacemos diferente: enseñamos IA aplicada exactamente al trabajo de quienes organizan, producen, venden y diseñan eventos.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className={`mt-6 text-base sm:text-lg leading-relaxed max-w-3xl transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-300"}`}>
            Nuestros programas están diseñados y liderados por el <strong className={isLight ? "text-gray-900" : "text-white"}>Dr. Guillermo Prado Vázquez</strong> — investigador en IA, especialista en eventos y finalista del Innovation Champion en los MPI Iberian Awards 2025 — con una visión única: la de alguien que domina la tecnología y vive el sector desde dentro.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <blockquote className={`relative mt-12 px-6 sm:px-8 py-8 sm:py-10 rounded-2xl overflow-hidden transition-colors duration-500 ${
            isLight
              ? "bg-gradient-to-br from-brand-magenta/8 via-white to-brand-fuchsia/6 border border-brand-magenta/15"
              : "bg-gradient-to-br from-azul/12 via-[#0d1829] to-blue-500/8 border border-azul/20"
          }`}>
            {/* Marca de cita sutil */}
            <span className={`absolute top-5 left-6 text-5xl sm:text-6xl font-serif leading-none select-none transition-colors duration-500 ${
              isLight ? "text-brand-magenta/15" : "text-azul/20"
            }`} aria-hidden>"</span>
            <div className="relative">
              <p className={`text-base sm:text-lg font-semibold tracking-tight m-0 mb-3 transition-colors duration-500 ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}>
                No enseñamos herramientas.
              </p>
              <p className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight m-0 transition-colors duration-500 ${
                isLight
                  ? "bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-brand-orange bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-azul via-blue-300 to-azul bg-clip-text text-transparent"
              }`}>
                Enseñamos a pensar con IA.
              </p>
            </div>
          </blockquote>
        </FadeIn>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// NUESTROS PROGRAMAS
// ════════════════════════════════════════════════════════
type Programa = {
  num: string;
  title: string;
  intro: string;
  listTitle: string;
  items: string[];
  duracion: string;
  dirigido: string;
  modalidad: string;
  extra?: string;
};

const PROGRAMAS_DATA: Programa[] = [
  {
    num: "01",
    title: "Taller Introductorio",
    intro: "Para profesionales que quieren dar sus primeros pasos en la IA de forma práctica, sin tecnicismos y aplicada directamente a su día a día en eventos.",
    listTitle: "¿Qué aprenderás?",
    items: [
      "Qué es la IA y cómo funciona en la práctica: conceptos clave sin jerga técnica, orientados a la toma de decisiones.",
      "Las herramientas de IA más útiles para eventos: ChatGPT, Claude, Midjourney, Canva AI, Notion AI y otras soluciones aplicadas a la producción y comunicación de eventos.",
      "Prompting efectivo para eventos: cómo escribir instrucciones precisas para obtener resultados profesionales en briefings, propuestas, copies y creatividades.",
      "Automatización de tareas repetitivas: correos, informes, resúmenes de reuniones, cronogramas y documentación con IA.",
      "Casos de uso reales del sector: ejemplos concretos de cómo agencias y organizadores ya están usando la IA en España.",
    ],
    duracion: "4 horas (formato intensivo) o 2 sesiones de 2 horas",
    dirigido: "Equipos de agencias, coordinadores de eventos, técnicos de comunicación",
    modalidad: "Presencial, online o híbrida",
  },
  {
    num: "02",
    title: "Programa Avanzado",
    intro: "Para profesionales que ya conocen las bases de la IA y quieren desarrollar una visión estratégica completa, integrando la inteligencia artificial en sus flujos de trabajo, propuestas y modelo de negocio.",
    listTitle: "¿Qué aprenderás?",
    items: [
      "Estrategia de IA para agencias de eventos: cómo posicionar la IA como ventaja competitiva frente a clientes y en procesos de licitación.",
      "Diseño de flujos de trabajo con IA: automatización de propuestas, briefings, seguimiento de clientes, gestión de proveedores y reporting.",
      "IA para la experiencia del asistente: herramientas y metodologías para diseñar activaciones, personalización y engagement con IA.",
      "Creación de contenido con IA: generación de imágenes, vídeos cortos, copies para RRSS, dossieres y presentaciones de forma ágil y profesional.",
      "Análisis de datos e informes de impacto: cómo usar IA para interpretar datos de asistentes, medir ROI y generar informes automatizados.",
      "Marco legal y ético: Ley de IA de la UE, protección de datos (RGPD), uso responsable de IA generativa y derechos de imagen.",
      "Herramientas avanzadas y agentes de IA: introducción a flujos de trabajo con agentes de IA, Make/Zapier con IA, GPTs personalizados para el sector.",
    ],
    duracion: "16 horas (4 sesiones de 4 horas) o formato intensivo de 2 días",
    dirigido: "Directores de agencias, project managers, responsables de innovación",
    modalidad: "Presencial, online o híbrida — con acceso a materiales y recursos tras la formación",
  },
  {
    num: "03",
    title: "Formación a Medida",
    intro: "Diseñamos programas completamente personalizados para empresas, departamentos o equipos con necesidades específicas. Desde una sesión de sensibilización para directivos hasta un programa de certificación interna para un equipo completo.",
    listTitle: "¿Cómo funciona?",
    items: [
      "Diagnóstico inicial: analizamos el nivel actual del equipo, los objetivos de negocio y las herramientas que ya utilizan.",
      "Diseño del programa: creamos un itinerario formativo adaptado, con los módulos, la duración y el ritmo que mejor se ajustan al equipo.",
      "Impartición: presencial en las instalaciones del cliente, online o híbrida, con materiales y ejercicios prácticos del sector.",
      "Seguimiento: sesión de resolución de dudas post-formación y acceso a recursos complementarios durante 30 días.",
    ],
    extra: "Hemos desarrollado programas a medida para agencias de comunicación y eventos, departamentos de marketing de IBEX 35 y equipos de producción que quieren integrar la IA en su operativa real sin interrumpir su flujo de trabajo habitual.",
    duracion: "Flexible — de 2 horas a varios días según las necesidades del cliente",
    dirigido: "Empresas, departamentos de eventos, equipos de marketing y comunicación",
    modalidad: "Adaptada al cliente — presencial, online o híbrida",
  },
];

function ProgramasSection({ isLight }: { isLight: boolean }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight)}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-12">
          <h2 className={`text-4xl sm:text-5xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Tres niveles, un mismo{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta to-brand-orange bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              objetivo
            </span>
          </h2>
          <p className={`mt-4 text-base max-w-2xl mx-auto transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Haz clic en un programa para ver el detalle.
          </p>
        </FadeIn>

        {/* Cartas pequeñas: solo título */}
        <FadeIn className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {PROGRAMAS_DATA.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setExpanded(expanded === i ? null : i)}
              className={`rounded-2xl border p-5 sm:p-6 text-left transition-colors duration-300 flex items-center gap-4 ${
                expanded === i
                  ? isLight
                    ? "bg-brand-magenta/10 border-brand-magenta/50 shadow-lg ring-2 ring-brand-magenta/20"
                    : "bg-azul/10 border-azul/50 shadow-lg ring-2 ring-azul/20"
                  : isLight
                    ? "bg-white/90 border-gray-100 hover:border-brand-magenta/30"
                    : "bg-[#0d1829]/90 border-white/8 hover:border-azul/40"
              }`}
            >
              <span className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white ${isLight ? "bg-brand-magenta" : "bg-azul"}`}>
                {p.num}
              </span>
              <span className={`font-bold text-base sm:text-lg transition-colors duration-500 truncate ${isLight ? "text-gray-900" : "text-white"}`}>
                {p.title}
              </span>
              <span className={`shrink-0 ml-auto transition-transform duration-300 ${expanded === i ? "rotate-180" : ""}`} aria-hidden>
                ▼
              </span>
            </button>
          ))}
        </FadeIn>

        {/* Contenido expandido: la carta se hace grande con todo dentro */}
        <AnimatePresence mode="wait">
          {expanded !== null && (
            <motion.div
              key={expanded}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                isLight
                  ? "bg-white/90 border-gray-100 shadow-xl backdrop-blur-sm border-brand-magenta/20"
                  : "bg-[#0d1829]/90 border-white/8 backdrop-blur-sm border-azul/30"
              }`}>
                <div className={`h-1 w-full ${isLight ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia" : "bg-gradient-to-r from-azul to-blue-400"}`} />
                <div className="p-8 sm:p-10">
                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                    <div className="shrink-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg ${isLight ? "bg-brand-magenta" : "bg-azul"}`}>
                        {PROGRAMAS_DATA[expanded].num}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-2xl sm:text-3xl font-black mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                        {PROGRAMAS_DATA[expanded].title}
                      </h3>
                      <p className={`text-base sm:text-lg leading-relaxed mb-8 text-balance ${isLight ? "text-gray-600" : "text-gray-300"}`}>
                        {PROGRAMAS_DATA[expanded].intro}
                      </p>

                      <div className={`rounded-xl p-5 mb-6 ${isLight ? "bg-gray-50/80" : "bg-white/5"}`}>
                        <p className={`text-sm font-bold mb-4 flex items-center gap-2 ${isLight ? "text-brand-magenta" : "text-azul"}`}>
                          <span aria-hidden>✓</span> {PROGRAMAS_DATA[expanded].listTitle}
                        </p>
                        <ul className={`space-y-3 text-sm sm:text-base leading-relaxed ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          {PROGRAMAS_DATA[expanded].items.map((item, j) => (
                            <li key={j} className="flex gap-3">
                              <span className={`shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full ${isLight ? "bg-brand-magenta" : "bg-azul"}`} aria-hidden />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {PROGRAMAS_DATA[expanded].extra && (
                        <p className={`text-sm leading-relaxed mb-6 pl-4 border-l-2 ${isLight ? "border-brand-magenta/40 text-gray-500" : "border-azul/40 text-gray-400"}`}>
                          {PROGRAMAS_DATA[expanded].extra}
                        </p>
                      )}

                      <div className={`grid sm:grid-cols-3 gap-6 pt-6 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                        <div className="flex gap-3">
                          <span className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg ${isLight ? "bg-brand-magenta/10 text-brand-magenta" : "bg-azul/15 text-azul"}`} aria-hidden>⏱</span>
                          <div>
                            <span className={`text-xs font-bold tracking-widest uppercase block mb-0.5 ${isLight ? "text-brand-magenta" : "text-azul"}`}>Duración</span>
                            <p className={`text-sm leading-snug ${isLight ? "text-gray-700" : "text-gray-300"}`}>{PROGRAMAS_DATA[expanded].duracion}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <span className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg ${isLight ? "bg-brand-magenta/10 text-brand-magenta" : "bg-azul/15 text-azul"}`} aria-hidden>👥</span>
                          <div>
                            <span className={`text-xs font-bold tracking-widest uppercase block mb-0.5 ${isLight ? "text-brand-magenta" : "text-azul"}`}>Dirigido a</span>
                            <p className={`text-sm leading-snug ${isLight ? "text-gray-700" : "text-gray-300"}`}>{PROGRAMAS_DATA[expanded].dirigido}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <span className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-lg ${isLight ? "bg-brand-magenta/10 text-brand-magenta" : "bg-azul/15 text-azul"}`} aria-hidden>📍</span>
                          <div>
                            <span className={`text-xs font-bold tracking-widest uppercase block mb-0.5 ${isLight ? "text-brand-magenta" : "text-azul"}`}>Modalidad</span>
                            <p className={`text-sm leading-snug ${isLight ? "text-gray-700" : "text-gray-300"}`}>{PROGRAMAS_DATA[expanded].modalidad}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// ¿PARA QUIÉN SON ESTAS FORMACIONES?
// ════════════════════════════════════════════════════════
function ParaQuienSection({ isLight }: { isLight: boolean }) {
  const publicos = [
    { label: "Agencias de eventos y comunicación", desc: "que quieren incorporar la IA en sus propuestas, operativa y diferenciación frente a la competencia." },
    { label: "Departamentos de marketing y eventos de empresa", desc: "que organizan eventos internos, lanzamientos de producto o convenciones y quieren hacerlo con más eficiencia e impacto." },
    { label: "Profesionales independientes del sector", desc: "coordinadores freelance, consultores y técnicos de eventos que quieren actualizar sus competencias y ser más competitivos." },
    { label: "Equipos de ventas de espacios y venues", desc: "que necesitan entender la IA para responder mejor a las demandas de sus clientes organizadores." },
  ];

  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight)}`}>
      <div className="max-w-4xl mx-auto relative z-10">
        <FadeIn className="text-center mb-12">
          <SectionLabel text="¿Para quién son estas formaciones?" isLight={isLight} />
          <h2 className={`text-3xl sm:text-4xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Dirigido a quienes quieren{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              liderar con IA
            </span>
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-5">
          {publicos.map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className={`flex gap-4 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 h-full ${
                isLight ? "bg-white/90 border-gray-100 hover:border-brand-magenta/20 hover:shadow-md" : "bg-[#0d1829]/80 border-white/5 hover:border-azul/30"
              }`}>
                <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors duration-500 ${isLight ? "bg-brand-magenta/10 text-brand-magenta" : "bg-azul/15 text-azul"}`} aria-hidden>
                  👤
                </span>
                <div className="min-w-0">
                  <p className={`font-bold text-base mb-1 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>{item.label}</p>
                  <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-400"}`}>{item.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// LO QUE HACE DIFERENTE NUESTRA FORMACIÓN
// ════════════════════════════════════════════════════════
function DiferenciasFormacionSection({ isLight }: { isLight: boolean }) {
  const items = [
    { icon: "🎯", title: "100% aplicada al sector MICE y eventos", desc: "No enseñamos IA genérica. Cada ejemplo, herramienta y ejercicio está pensado para la realidad de un profesional de eventos." },
    { icon: "👤", title: "Formador con credencial científica y experiencia de sector", desc: "Una combinación que no encontrarás en ninguna otra formación del mercado español." },
    { icon: "⚡", title: "Práctica desde el primer minuto", desc: "Nada de diapositivas interminables: trabajamos con herramientas reales y casos aplicables desde el mismo día." },
    { icon: "🔄", title: "Actualización continua", desc: "El mundo de la IA cambia cada semana. Nuestros programas se actualizan constantemente para incluir las herramientas y tendencias más relevantes." },
    { icon: "⚖️", title: "Cumplimiento legal integrado", desc: "Abordamos el uso ético y legal de la IA desde el inicio, incluyendo la Ley de IA de la UE y el RGPD aplicado al sector." },
  ];

  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight, true)}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <SectionLabel text="Lo que hace diferente nuestra formación" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Cinco razones para elegir{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              Externia
            </span>
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <TiltCard className={`rounded-2xl border overflow-hidden transition-all duration-300 h-full flex flex-col ${
                isLight
                  ? "bg-white/90 border-gray-100 hover:border-brand-magenta/30 backdrop-blur-sm"
                  : "bg-[#0d1829]/80 border-white/5 hover:border-azul/40 backdrop-blur-sm"
              }`}>
                <div className={`w-full h-1 flex-shrink-0 transition-colors duration-500 ${isLight ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia" : "bg-gradient-to-r from-azul to-blue-400"}`} />
                <div className="p-6 flex-1 flex flex-col">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-colors duration-500 ${isLight ? "bg-brand-magenta/10" : "bg-azul/15"}`}>
                    {item.icon}
                  </div>
                  <h3 className={`text-lg font-bold mb-2 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>{item.title}</h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-500 flex-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>{item.desc}</p>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// CTA
// ════════════════════════════════════════════════════════
function CTASection({ isLight }: { isLight: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <section className={`relative py-32 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight)}`}>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-12 pointer-events-none transition-colors duration-500 ${isLight ? "bg-brand-magenta" : "bg-azul"}`} />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <FadeIn>
          <SectionLabel text="¿Listo para formarte?" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Da el siguiente paso con{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-brand-orange bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul via-blue-300 to-azul bg-clip-text text-transparent"}>
              IA aplicada a eventos
            </span>
          </h2>
          <p className={`text-lg mb-10 max-w-xl mx-auto transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Elige el programa que mejor se adapte a tu equipo y contacta con nosotros. Te respondemos sin compromiso.
          </p>

          <motion.a href="#contacto" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
            className={`inline-block px-12 py-5 rounded-full text-lg font-bold text-white transition-shadow duration-300 ${isLight ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia" : "bg-azul"}`}
            style={hovered ? { boxShadow: isLight ? "0 0 50px #DE3B8490, 0 0 100px #D6007D40" : "0 0 50px #0070f390, 0 0 100px #0070f340" } : {}}>
            Contactar →
          </motion.a>
        </FadeIn>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════
export default function Formacion() {
  const isLight = useTheme();

  return (
    <>
      <BubblesBg isLight={isLight} />
      <div className="relative z-10 transition-colors duration-500">
        <HeroSection isLight={isLight} />
        <PorQueSection isLight={isLight} />
        <ProgramasSection isLight={isLight} />
        <ParaQuienSection isLight={isLight} />
        <DiferenciasFormacionSection isLight={isLight} />
        <CTASection isLight={isLight} />
      </div>
    </>
  );
}
