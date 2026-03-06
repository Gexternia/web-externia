/**
 * Formacion.tsx — Formaciones en IA para Eventos. Mismo diseño que Quiénes Somos.
 * Fondo de burbujas, tema claro/oscuro, secciones con FadeIn y TiltCard.
 */
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

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
          <p className={`text-base sm:text-lg leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-300"}`}>
            La inteligencia artificial ya está redefiniendo la industria de los eventos. Sin embargo, la mayoría de la formación en IA disponible es genérica, orientada a desarrolladores o desconectada de la realidad del sector MICE. En Externia lo hacemos diferente: enseñamos IA aplicada exactamente al trabajo de quienes organizan, producen, venden y diseñan eventos.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className={`mt-6 text-base sm:text-lg leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-300"}`}>
            Nuestros programas están diseñados y liderados por el <strong className={isLight ? "text-gray-900" : "text-white"}>Dr. Guillermo Prado Vázquez</strong> — investigador en IA, especialista en eventos y finalista del Innovation Champion en los MPI Iberian Awards 2025 — con una visión única: la de alguien que domina la tecnología y vive el sector desde dentro.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className={`mt-8 text-xl font-bold transition-colors duration-500 ${isLight ? "text-brand-magenta" : "text-azul"}`}>
            No enseñamos herramientas. Enseñamos a pensar con IA.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// NUESTROS PROGRAMAS
// ════════════════════════════════════════════════════════
function ProgramasSection({ isLight }: { isLight: boolean }) {
  const programas = [
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

  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight)}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <SectionLabel text="Nuestros programas" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Tres niveles, un mismo{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta to-brand-orange bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              objetivo
            </span>
          </h2>
          <p className={`mt-4 text-base max-w-2xl mx-auto transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Todos los formatos disponibles en modalidad presencial, online o híbrida.
          </p>
        </FadeIn>

        <div className="space-y-12">
          {programas.map((p, i) => (
            <FadeIn key={i} delay={i * 0.1} from="left">
              <TiltCard className={`rounded-2xl border p-8 sm:p-10 transition-all duration-300 ${
                isLight
                  ? "bg-white/90 border-gray-100 shadow-sm backdrop-blur-sm hover:border-brand-magenta/30"
                  : "bg-[#0d1829]/90 border-white/8 backdrop-blur-sm hover:border-azul/40"
              }`}>
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white transition-colors duration-500 ${isLight ? "bg-brand-magenta" : "bg-azul"}`}>
                    {p.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-2xl font-black mb-3 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>{p.title}</h3>
                    <p className={`text-base leading-relaxed mb-6 transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-300"}`}>{p.intro}</p>
                    <p className={`text-sm font-bold mb-2 transition-colors duration-500 ${isLight ? "text-brand-magenta" : "text-azul"}`}>{p.listTitle}</p>
                    <ul className={`space-y-2 text-sm sm:text-base leading-relaxed list-disc list-inside mb-6 transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      {p.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                    {p.extra && (
                      <p className={`text-sm leading-relaxed mb-6 transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>{p.extra}</p>
                    )}
                    <div className={`grid sm:grid-cols-3 gap-4 pt-4 border-t transition-colors duration-500 ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      <div>
                        <span className={`text-xs font-bold tracking-widest uppercase transition-colors duration-500 ${isLight ? "text-brand-magenta" : "text-azul"}`}>Duración</span>
                        <p className={`text-sm mt-0.5 transition-colors duration-500 ${isLight ? "text-gray-700" : "text-gray-300"}`}>{p.duracion}</p>
                      </div>
                      <div>
                        <span className={`text-xs font-bold tracking-widest uppercase transition-colors duration-500 ${isLight ? "text-brand-magenta" : "text-azul"}`}>Dirigido a</span>
                        <p className={`text-sm mt-0.5 transition-colors duration-500 ${isLight ? "text-gray-700" : "text-gray-300"}`}>{p.dirigido}</p>
                      </div>
                      <div>
                        <span className={`text-xs font-bold tracking-widest uppercase transition-colors duration-500 ${isLight ? "text-brand-magenta" : "text-azul"}`}>Modalidad</span>
                        <p className={`text-sm mt-0.5 transition-colors duration-500 ${isLight ? "text-gray-700" : "text-gray-300"}`}>{p.modalidad}</p>
                      </div>
                    </div>
                  </div>
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
// TU FORMADOR
// ════════════════════════════════════════════════════════
function FormadorSection({ isLight }: { isLight: boolean }) {
  const puntos = [
    "Doctor en Biociencias Moleculares: por la Universidad Autónoma de Madrid, con investigación en IA aplicada a oncología en el Hospital La Paz.",
    "Especialista en eventos: con experiencia directa en producción y gestión de eventos corporativos y MICE en España.",
    "Finalista del Innovation Champion: en los MPI Iberian Awards 2025, reconocimiento a la innovación en la industria de los eventos.",
    "Divulgador y ponente: en conferencias del sector como el Ibiza MICE Summit y otros eventos de referencia de la industria.",
  ];

  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight, true)}`}>
      <div className="max-w-5xl mx-auto relative z-10">
        <FadeIn className="text-center mb-12">
          <SectionLabel text="Tu formador" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Guillermo Prado Vázquez
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className={`text-lg leading-relaxed text-center mb-10 transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-300"}`}>
            Todas las formaciones están lideradas por Guillermo Prado Vázquez, fundador de Externia. Su perfil es genuinamente único en el mercado español:
          </p>
        </FadeIn>

        <ul className={`space-y-4 mb-10 transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-300"}`}>
          {puntos.map((p, i) => (
            <FadeIn key={i} delay={0.15 + i * 0.05} from="left">
              <li className="flex gap-3">
                <span className={`shrink-0 mt-1 w-2 h-2 rounded-full transition-colors duration-500 ${isLight ? "bg-brand-magenta" : "bg-azul"}`} />
                <span className="text-base leading-relaxed">{p}</span>
              </li>
            </FadeIn>
          ))}
        </ul>

        <FadeIn delay={0.4}>
          <p className={`text-base leading-relaxed text-center transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            Guillermo combina el rigor de la investigación científica con el conocimiento práctico del sector. Sus formaciones no son teóricas: son sesiones prácticas, con herramientas reales, casos del sector y resultados inmediatamente aplicables.
          </p>
        </FadeIn>
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

        <div className="space-y-4">
          {publicos.map((item, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className={`flex gap-4 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
                isLight ? "bg-white/90 border-gray-100" : "bg-[#0d1829]/80 border-white/5 hover:border-azul/30"
              }`}>
                <span className={`shrink-0 text-xl transition-colors duration-500 ${isLight ? "text-brand-magenta" : "text-azul"}`}>→</span>
                <div>
                  <span className={`font-bold transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>{item.label}</span>
                  <span className={`text-sm sm:text-base transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-400"}`}> {item.desc}</span>
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
              <TiltCard className={`p-6 rounded-2xl border transition-all duration-300 ${
                isLight
                  ? "bg-white/90 border-gray-100 hover:border-brand-magenta/30 backdrop-blur-sm"
                  : "bg-[#0d1829]/80 border-white/5 hover:border-azul/40 backdrop-blur-sm"
              }`}>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className={`text-lg font-bold mb-2 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>{item.title}</h3>
                <p className={`text-sm leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-600" : "text-gray-400"}`}>{item.desc}</p>
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
          <p className={`text-lg mb-10 transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Elige el programa que mejor se adapte a tu equipo y contacta con nosotros.
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
        <FormadorSection isLight={isLight} />
        <ParaQuienSection isLight={isLight} />
        <DiferenciasFormacionSection isLight={isLight} />
        <CTASection isLight={isLight} />
      </div>
    </>
  );
}
