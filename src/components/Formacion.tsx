/**
 * Formacion.tsx — Formaciones en IA para Eventos. Mismo diseño que Quiénes Somos.
 * Fondo de burbujas, tema claro/oscuro, secciones con FadeIn y TiltCard.
 */
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ── Single RAF-batched global mouse tracker (1 listener for all magnetic elements)
let _gMouseX = -9999, _gMouseY = -9999, _gMouseRaf = false, _gMouseInit = false;
const _gMouseSubs = new Set<(x: number, y: number) => void>();
function _ensureGlobalMouse() {
  if (_gMouseInit || typeof window === "undefined") return;
  _gMouseInit = true;
  window.addEventListener(
    "mousemove",
    (e) => {
      _gMouseX = e.clientX; _gMouseY = e.clientY;
      if (!_gMouseRaf) {
        _gMouseRaf = true;
        requestAnimationFrame(() => { _gMouseRaf = false; _gMouseSubs.forEach((fn) => fn(_gMouseX, _gMouseY)); });
      }
    },
    { passive: true }
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

const lightBg = "bg-white/65 backdrop-blur-[2px]";
const lightAltBg = "bg-gray-50/65 backdrop-blur-[2px]";
const darkBg = "bg-[#060d1a]/72 backdrop-blur-[2px]";
const darkAltBg = "bg-[#08111e]/72 backdrop-blur-[2px]";
function sectionBg(isLight: boolean, alt = false) {
  return isLight ? (alt ? lightAltBg : lightBg) : (alt ? darkAltBg : darkBg);
}

// ── Magnetic Repulsion ────────────────────────────────────────────
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
    _gMouseSubs.add(cb);
    return () => { _gMouseSubs.delete(cb); };
  }, [strength, radius]);
  return <motion.div ref={ref} style={{ x: sx, y: sy }}>{children}</motion.div>;
}

// ── Magnetic Attraction ───────────────────────────────────────────
function MagneticAttract({ children, strength = 18, radius = 82 }: { children: React.ReactNode; strength?: number; radius?: number }) {
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
    _gMouseSubs.add(cb);
    return () => { _gMouseSubs.delete(cb); };
  }, [strength, radius]);
  return <motion.div ref={ref} style={{ x: sx, y: sy, display: "inline-block" }}>{children}</motion.div>;
}

// ── AI Network Particles (deferred, reduced on mobile) ─────────────
function NetworkParticlesBg({ isLight }: { isLight: boolean }) {
  const [ready, setReady] = useState(false);
  const [ParticlesCmp, setParticlesCmp] = useState<typeof import("@tsparticles/react").Particles | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [reactMod, { loadSlim }] = await Promise.all([
        import("@tsparticles/react"),
        import("@tsparticles/slim"),
      ]);
      if (cancelled) return;
      const { Particles: P, initParticlesEngine } = reactMod;
      setParticlesCmp(() => P);
      await initParticlesEngine(async (engine) => { await loadSlim(engine); });
      if (!cancelled) setReady(true);
    };
    const id = window.setTimeout(() => load(), 120);
    return () => { cancelled = true; clearTimeout(id); };
  }, []);

  if (!ready || !ParticlesCmp) return null;
  const accent = isLight ? "#DE3B84" : "#0070f3";

  return (
    <ParticlesCmp
      id="form-network"
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
          number: { density: { enable: true, area: 1100 }, value: 32 },
          opacity: { value: { min: isLight ? 0.49 : 0.65, max: isLight ? 0.75 : 1.0 } },
          size: { value: { min: 2.5, max: 4 } },
          shape: { type: "circle" },
        },
        detectRetina: false,
      }}
    />
  );
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
            <MagneticRepel key={i} strength={35} radius={150}>
              <FadeIn delay={i * 0.08}>
              <div className={`flex gap-4 p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 h-full ${
                isLight ? "bg-white/90 border-gray-100 hover:border-brand-magenta/20 hover:shadow-md" : "bg-[#0d1829]/80 border-white/5 hover:border-azul/30"
              }`}>
                <MagneticAttract strength={14} radius={60}>
                <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors duration-500 ${isLight ? "bg-brand-magenta/10 text-brand-magenta" : "bg-azul/15 text-azul"}`} aria-hidden>
                  👤
                </span>
                </MagneticAttract>
                <div className="min-w-0">
                  <p className={`font-bold text-base mb-1 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>{item.label}</p>
                  <p className={`text-sm sm:text-base leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-400"}`}>{item.desc}</p>
                </div>
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
            <MagneticRepel key={i}>
              <FadeIn delay={i * 0.08}>
                <TiltCard className={`rounded-2xl border overflow-hidden transition-all duration-300 h-full flex flex-col ${
                  isLight
                    ? "bg-white/90 border-gray-100 hover:border-brand-magenta/30 backdrop-blur-sm"
                    : "bg-[#0d1829]/80 border-white/5 hover:border-azul/40 backdrop-blur-sm"
                }`}>
                  <div className={`w-full h-1 flex-shrink-0 transition-colors duration-500 ${isLight ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia" : "bg-gradient-to-r from-azul to-blue-400"}`} />
                  <div className="p-6 flex-1 flex flex-col">
                    <MagneticAttract>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-colors duration-500 ${isLight ? "bg-brand-magenta/10" : "bg-azul/15"}`}>
                        {item.icon}
                      </div>
                    </MagneticAttract>
                    <h3 className={`text-lg font-bold mb-2 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>{item.title}</h3>
                    <p className={`text-sm leading-relaxed transition-colors duration-500 flex-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>{item.desc}</p>
                  </div>
                </TiltCard>
              </FadeIn>
            </MagneticRepel>
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
  const primaryRef = useRef<HTMLSpanElement>(null);
  const cloneRef = useRef<HTMLSpanElement>(null);
  const TR = "transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)";

  const onBtnEnter = () => {
    setHovered(true);
    if (!primaryRef.current || !cloneRef.current) return;
    // Snap both to their known idle positions first, then animate
    primaryRef.current.style.transition = "none";
    primaryRef.current.style.transform = "translateX(0%)";
    cloneRef.current.style.transition = "none";
    cloneRef.current.style.transform = "translateX(-110%)";
    primaryRef.current.getBoundingClientRect(); // force reflow
    primaryRef.current.style.transition = TR;
    primaryRef.current.style.transform = "translateX(110%)";
    cloneRef.current.style.transition = TR;
    cloneRef.current.style.transform = "translateX(0%)";
  };

  const onBtnLeave = () => {
    setHovered(false);
    if (!primaryRef.current || !cloneRef.current) return;
    // Snap both to their known hover positions first, then animate back
    primaryRef.current.style.transition = "none";
    primaryRef.current.style.transform = "translateX(-110%)";
    cloneRef.current.style.transition = "none";
    cloneRef.current.style.transform = "translateX(0%)";
    cloneRef.current.getBoundingClientRect(); // force reflow
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

          <motion.a href="#contacto" whileTap={{ scale: 0.97 }}
            onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}
            className={`relative inline-block overflow-hidden px-12 py-5 rounded-full text-lg font-bold text-white transition-shadow duration-300 ${isLight ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia" : "bg-azul"}`}
            style={hovered ? { boxShadow: isLight ? "0 0 50px #DE3B8490, 0 0 100px #D6007D40" : "0 0 50px #0070f390, 0 0 100px #0070f340" } : {}}>
            <span className="invisible whitespace-nowrap">Contactar →</span>
            <span ref={primaryRef} aria-hidden
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
              style={{ transform: "translateX(0%)" }}>
              Contactar →
            </span>
            <span ref={cloneRef} aria-hidden
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
              style={{ transform: "translateX(-110%)" }}>
              Contactar →
            </span>
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
      <NetworkParticlesBg isLight={isLight} />
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
