/**
 * QuienesSomos.tsx — Interactive About Us page for Externia.
 * Light mode: brand colors. Dark mode: deep navy palette.
 */
import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, useMotionValue, useSpring, useAnimation } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// ── Single RAF-batched global mouse tracker (1 listener for ALL magnetic elements)
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

// ── Interactive canvas bubbles background ─────────────────────────
type BubbleData = { x: number; y: number; r: number; vx: number; vy: number; baseVy: number; opacity: number; phase: number };

function BubblesBg({ isLight }: { isLight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const bubblesRef = useRef<BubbleData[]>([]);
  const rafRef = useRef(0);

  // Init canvas size + bubble positions (runs once)
  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = canvas.width, H = canvas.height, N = 20;
    bubblesRef.current = Array.from({ length: N }, (_, i) => {
      const baseVy = -(0.3 + (i * 0.14) % 0.7);
      return {
        x: (i * (W / N) + 18) % W,
        y: (i * 97.3) % H,
        r: 14 + (i * 18.9) % 54,
        vx: (i % 2 === 0 ? 1 : -1) * ((i * 0.11) % 0.22),
        vy: baseVy,
        baseVy,
        opacity: 0.48 + (i * 0.021) % 0.32,
        phase: (i * 0.68) % (Math.PI * 2),
      };
    });

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Track mouse
  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Animation loop (re-runs when theme changes to swap color)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const [cr, cg, cb] = isLight ? [222, 59, 132] : [40, 120, 255];

    const tick = (now: number) => {
      if (!canvas.width || !canvas.height) { rafRef.current = requestAnimationFrame(tick); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: mx, y: my } = mouseRef.current;
      const t = Date.now() * 0.001;

      for (const b of bubblesRef.current) {
        // Mouse repulsion
        const dx = b.x - mx, dy = b.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelR = 150;
        if (dist < repelR && dist > 1) {
          const f = ((repelR - dist) / repelR) * 1.4;
          b.vx += (dx / dist) * f;
          b.vy += (dy / dist) * f;
        }

        // Damping — settle back to natural upward drift
        b.vx *= 0.94;
        b.vy = b.vy * 0.95 + b.baseVy * 0.05;

        // Horizontal sine wobble + apply velocity
        b.x += b.vx + Math.sin(t * 0.38 + b.phase) * 0.28;
        b.y += b.vy;

        // Wrap vertically
        if (b.y + b.r < 0) {
          b.y = canvas.height + b.r;
          b.x = Math.random() * canvas.width;
          b.vx = (Math.random() - 0.5) * 0.2;
          b.vy = b.baseVy;
        }
        if (b.x < -b.r) b.x = canvas.width + b.r;
        if (b.x > canvas.width + b.r) b.x = -b.r;

        // Proximity glow factor
        const proximity = Math.max(0, 1 - dist / repelR);
        const glow = b.opacity + proximity * 0.45;

        // Inner fill gradient (very subtle, soap-bubble iridescence)
        const fill = ctx.createRadialGradient(b.x - b.r * 0.28, b.y - b.r * 0.28, 0, b.x, b.y, b.r);
        fill.addColorStop(0, `rgba(${cr},${cg},${cb},${glow * 0.09})`);
        fill.addColorStop(0.55, `rgba(${cr},${cg},${cb},${glow * 0.04})`);
        fill.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();

        // Outer glow halo when mouse is near
        if (proximity > 0.04) {
          const halo = ctx.createRadialGradient(b.x, b.y, b.r * 0.85, b.x, b.y, b.r * 1.7);
          halo.addColorStop(0, `rgba(${cr},${cg},${cb},${proximity * 0.18})`);
          halo.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r * 1.7, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();
        }

        // Border stroke
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${cr},${cg},${cb},${Math.min(0.72, glow * 0.82)})`;
        ctx.lineWidth = 1.2 + proximity * 1.2;
        ctx.stroke();

        // Specular highlight — top-left shiny spot (soap bubble look)
        const hl = ctx.createRadialGradient(
          b.x - b.r * 0.34, b.y - b.r * 0.34, 0,
          b.x - b.r * 0.34, b.y - b.r * 0.34, b.r * 0.34
        );
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
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 30,
        pointerEvents: "none",
      }}
    />
  );
}

// ── Theme hook ────────────────────────────────────────────────────
function useTheme() {
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
    const handler = (e: Event) =>
      setIsLight(!(e as CustomEvent).detail.isDark);
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);
  return isLight;
}

// ── Animated counter ──────────────────────────────────────────────
function Counter({ value, suffix = "+", replay = 0 }: { value: number; suffix?: string; replay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    setN(0); // reset to 0 before counting up
    const end = Date.now() + 2200;
    const tick = () => {
      const t = Math.min(1, 1 - (end - Date.now()) / 2200);
      setN(Math.round((1 - Math.pow(1 - t, 3)) * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, replay]); // replay change re-triggers the animation
  return <span ref={ref}>{n.toLocaleString("es-ES")}{suffix}</span>;
}

// ── 3D Tilt card ─────────────────────────────────────────────────
// ── 3D Tilt card ─────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  const [s, setS] = useState({});
  const onMove = (e: React.MouseEvent) => {
    const r = el.current!.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -18;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 18;
    setS({ transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`, transition: "transform 0.12s ease" });
  };
  const onLeave = () =>
    setS({ transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)", transition: "transform 0.5s ease" });
  return (
    <div ref={el} onMouseMove={onMove} onMouseLeave={onLeave} style={s} className={className}>
      {children}
    </div>
  );
}

// ── Scroll-reveal wrapper ─────────────────────────────────────────
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

// ── Flip card for services ────────────────────────────────────────

// ─── Push Robot — side-profile, horizontal arms that clearly extend outside body ──
function PushRobot({ walking = false }: { walking?: boolean }) {
  const t = (delay = 0) =>
    walking
      ? { duration: 0.42, repeat: Infinity, repeatType: "mirror" as const, ease: [0.4, 0, 0.2, 1], delay }
      : { duration: 0.15, ease: "easeOut" };

  return (
    <svg width="62" height="86" viewBox="0 0 62 86" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rp-body" x1="0" y1="0" x2="0" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9B5CF8"/>
          <stop offset="100%" stopColor="#3B82F6"/>
        </linearGradient>
        <linearGradient id="rp-dark" x1="0" y1="0" x2="0" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6B30C0"/>
          <stop offset="100%" stopColor="#1E50B0"/>
        </linearGradient>
      </defs>

      {/* Antenna */}
      <rect x="24" y="0" width="4" height="12" rx="2" fill="url(#rp-dark)" opacity="0.85"/>
      <circle cx="26" cy="2.5" r="4.5" fill="white" opacity="0.9"/>
      <circle cx="26" cy="2.5" r="2.5" fill="#DDD0FF"/>

      {/* Head — BIG */}
      <rect x="6" y="10" width="40" height="30" rx="7" fill="url(#rp-body)" stroke="url(#rp-dark)" strokeWidth="1.5"/>
      <rect x="9" y="13" width="18" height="8" rx="3.5" fill="white" opacity="0.18"/>
      {/* Eye — side profile, front face */}
      <circle cx="42" cy="25" r="6" fill="white" opacity="0.9"/>
      <circle cx="42" cy="25" r="3.3" fill="#D0B8FF" opacity="0.85"/>

      {/* Neck */}
      <rect x="21" y="40" width="10" height="5" rx="2.5" fill="url(#rp-dark)" opacity="0.8"/>

      {/* Body — smaller than head */}
      <rect x="13" y="45" width="26" height="20" rx="6" fill="url(#rp-body)" stroke="url(#rp-dark)" strokeWidth="1.5"/>
      <rect x="16" y="48" width="12" height="6" rx="3" fill="white" opacity="0.13"/>
      <circle cx="29" cy="55" r="3" fill="white" opacity="0.22"/>

      {/* Back arm — HORIZONTAL, extends LEFT from body (clearly visible) */}
      <motion.g
        style={{ transformOrigin: "100% 50%" }}
        animate={{ rotate: walking ? [-10, 12] : 2 }}
        transition={t()}
      >
        <rect x="1" y="50" width="13" height="7" rx="3.5" fill="url(#rp-body)" stroke="url(#rp-dark)" strokeWidth="1.2"/>
      </motion.g>

      {/* Front arm — HORIZONTAL, extends RIGHT from body (pushing arm) */}
      <motion.g
        style={{ transformOrigin: "0% 50%" }}
        animate={{ rotate: walking ? [-18, 16] : -8 }}
        transition={t(0.19)}
      >
        <rect x="39" y="50" width="18" height="7" rx="3.5" fill="url(#rp-body)" stroke="url(#rp-dark)" strokeWidth="1.2"/>
      </motion.g>

      {/* Back leg */}
      <motion.g
        style={{ transformOrigin: "50% 0%" }}
        animate={{ rotate: walking ? [8, -6] : 8 }}
        transition={t()}
      >
        <rect x="15" y="65" width="10" height="18" rx="4" fill="url(#rp-body)" stroke="url(#rp-dark)" strokeWidth="1"/>
      </motion.g>

      {/* Front leg */}
      <motion.g
        style={{ transformOrigin: "50% 0%" }}
        animate={{ rotate: walking ? [-8, 6] : -8 }}
        transition={t(0.19)}
      >
        <rect x="27" y="65" width="10" height="18" rx="4" fill="url(#rp-body)" stroke="url(#rp-dark)" strokeWidth="1"/>
      </motion.g>
    </svg>
  );
}

// ─── Pull Robot — front-facing, horizontal arms extending from sides ──
function PullRobot({ pulling = false }: { pulling?: boolean }) {
  const t = (delay = 0) =>
    pulling
      ? { duration: 0.42, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut", delay }
      : { duration: 0.15, ease: "easeOut" };

  return (
    <svg width="80" height="96" viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rpu-body" x1="0" y1="0" x2="0" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9B5CF8"/>
          <stop offset="100%" stopColor="#3B82F6"/>
        </linearGradient>
        <linearGradient id="rpu-dark" x1="0" y1="0" x2="0" y2="96" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6B30C0"/>
          <stop offset="100%" stopColor="#1E50B0"/>
        </linearGradient>
      </defs>

      {/* Antenna */}
      <rect x="37" y="0" width="6" height="12" rx="2" fill="url(#rpu-dark)" opacity="0.85"/>
      <circle cx="40" cy="2.5" r="5" fill="white" opacity="0.9"/>
      <circle cx="40" cy="2.5" r="2.8" fill="#DDD0FF"/>

      {/* Head — BIG */}
      <rect x="13" y="10" width="54" height="38" rx="8" fill="url(#rpu-body)" stroke="url(#rpu-dark)" strokeWidth="1.5"/>
      <rect x="17" y="13" width="24" height="9" rx="3.5" fill="white" opacity="0.16"/>
      {/* Left eye */}
      <circle cx="28" cy="32" r="7" fill="white" opacity="0.9"/>
      <circle cx="28" cy="32" r="4" fill="#D0B8FF" opacity="0.85"/>
      {/* Right eye */}
      <circle cx="52" cy="32" r="7" fill="white" opacity="0.9"/>
      <circle cx="52" cy="32" r="4" fill="#D0B8FF" opacity="0.85"/>

      {/* Neck */}
      <rect x="36" y="48" width="8" height="6" rx="3" fill="url(#rpu-dark)" opacity="0.8"/>

      {/* Body — smaller than head */}
      <rect x="21" y="54" width="38" height="26" rx="7" fill="url(#rpu-body)" stroke="url(#rpu-dark)" strokeWidth="1.5"/>
      <rect x="25" y="57" width="17" height="7" rx="3" fill="white" opacity="0.13"/>
      <circle cx="32" cy="71" r="3.5" fill="white" opacity="0.22"/>
      <circle cx="48" cy="71" r="3.5" fill="white" opacity="0.22"/>

      {/* Left leg */}
      <rect x="27" y="79" width="11" height="17" rx="4" fill="url(#rpu-body)" stroke="url(#rpu-dark)" strokeWidth="1"/>
      {/* Right leg */}
      <rect x="42" y="79" width="11" height="17" rx="4" fill="url(#rpu-body)" stroke="url(#rpu-dark)" strokeWidth="1"/>
    </svg>
  );
}

// ─── FlipCard ─────────────────────────────────────────────────────────────────
// OPEN:  PushRobot enters from left, leans forward + waddling, pushes curtain right.
// CLOSE: PullRobot rises from below, pulls ropes → two curtain halves close from both sides.
function FlipCard({ icon, title, desc, gradient, isLight }: {
  icon: string; title: string; desc: string; gradient: string; isLight: boolean;
}) {
  const [phase, setPhase] = useState<"idle" | "opening" | "open" | "closing">("idle");
  const curtainCtrl = useAnimation();   // main front panel (open animation)
  const leftCtrl    = useAnimation();   // left closing half
  const rightCtrl   = useAnimation();   // right closing half
  const pushBotCtrl = useAnimation();   // push robot
  const pullBotCtrl = useAnimation();   // pull robot
  const leftArmCtrl  = useAnimation();  // left arm bar
  const rightArmCtrl = useAnimation();  // right arm bar
  const busyRef = useRef(false);

  const doOpen = async () => {
    setPhase("opening");

    // 1. Robot pops in from the left edge
    await pushBotCtrl.start({
      x: -15, opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 22 },
    });

    // 2. Robot walks across; curtain follows with spring physics (heavy object being pushed)
    const p1 = pushBotCtrl.start({
      x: 370,
      y: [0, -7, 0, -7, 0, -7, 0, -7, 0, -7, 0],
      transition: {
        x: { duration: 2.0, ease: "linear" },
        y: { duration: 2.0 },
      },
    });
    // Curtain moves in exact sync with the robot (linear, same total time)
    const p2 = curtainCtrl.start({
      x: "110%",
      transition: { duration: 1.92, ease: "linear", delay: 0.08 },
    });
    await Promise.all([p1, p2]);

    pushBotCtrl.set({ x: -90, opacity: 0, y: 0 });
    setPhase("open");
    busyRef.current = false;
  };

  const doClose = async () => {
    setPhase("closing");

    leftCtrl.set({ x: "-101%", opacity: 1 });
    rightCtrl.set({ x: "101%", opacity: 1 });
    leftArmCtrl.set({ scaleY: 0, opacity: 0, rotate: -28, x: 0 });
    rightArmCtrl.set({ scaleY: 0, opacity: 0, rotate:  28, x: 0 });

    // 1. Robot springs up
    await pullBotCtrl.start({
      y: 0, opacity: 1,
      transition: { type: "spring", stiffness: 220, damping: 20 },
    });

    // 2. Robot tugs + arms grow UP at the curtain edge simultaneously
    pullBotCtrl.start({
      y: [0, -12, 3, -9, 2, -6, 0],
      rotate: [0, -5, 4, -4, 3, -2, 0],
      transition: { duration: 1.1, ease: "easeInOut" },
    });
    await Promise.all([
      leftArmCtrl.start({ scaleY: 1, opacity: 1, transition: { duration: 0.28 } }),
      rightArmCtrl.start({ scaleY: 1, opacity: 1, transition: { duration: 0.28 } }),
    ]);

    // 3. Curtains close + arms retract — 50% slower tween
    const closeCfg = { type: "tween" as const, duration: 1.5, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] };
    const p1 = leftCtrl.start({ x: "0%", transition: closeCfg });
    const p2 = rightCtrl.start({ x: "0%", transition: closeCfg });
    const p3 = leftArmCtrl.start({ rotate: -4, scaleY: 0, opacity: 0, transition: closeCfg });
    const p4 = rightArmCtrl.start({ rotate:  4, scaleY: 0, opacity: 0, transition: closeCfg });
    await Promise.all([p1, p2, p3, p4]);

    // 4. Robot drops back down
    await pullBotCtrl.start({
      y: 110, opacity: 0,
      transition: { duration: 0.32, ease: "easeIn" },
    });

    curtainCtrl.set({ x: "0%" });
    leftCtrl.set({ opacity: 0 });
    rightCtrl.set({ opacity: 0 });
    pullBotCtrl.set({ y: 110, opacity: 0 });
    leftArmCtrl.set({ scaleY: 0, opacity: 0, rotate: -28, x: 0 });
    rightArmCtrl.set({ scaleY: 0, opacity: 0, rotate:  28, x: 0 });

    setPhase("idle");
    busyRef.current = false;
  };

  const handleClick = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    if (phase === "idle") doOpen();
    else if (phase === "open") doClose();
    else busyRef.current = false;
  };

  const cardFaceCls = isLight
    ? "bg-white/90 border-gray-100 shadow-sm backdrop-blur-sm"
    : "bg-[#0d1829]/90 border-white/8 backdrop-blur-sm";

  return (
    <div className="relative cursor-pointer overflow-hidden rounded-2xl" onClick={handleClick}>

      {/* ── Card with overflow:hidden (clips curtains & push robot only) ── */}
      <div className="relative h-72 overflow-hidden rounded-2xl">

        {/* ── Back layer: revealed content ── */}
        <div className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 p-6 text-center bg-gradient-to-br ${gradient}`}>
          <motion.div
            animate={{ scale: phase === "open" ? 1 : 0.7, opacity: phase === "open" ? 1 : 0 }}
            transition={{ duration: 0.42, delay: phase === "open" ? 0.1 : 0, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-white/95 leading-relaxed">{desc}</p>
            <span className="text-xs text-white/60 mt-1">Click para cerrar</span>
          </motion.div>
        </div>

        {/* ── Main front curtain (opening animation only) ── */}
        <motion.div
          animate={curtainCtrl}
          initial={{ x: "0%" }}
          className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 p-6 text-center border transition-colors duration-500 ${cardFaceCls}`}
          style={{ willChange: "transform", zIndex: 10 }}
        >
          <span className="text-5xl">{icon}</span>
          <h3 className={`text-lg font-bold transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            {title}
          </h3>
          <span className={`text-xs font-medium transition-colors duration-500 ${isLight ? "text-gray-400" : "text-gray-500"}`}>
            Click para revelar
          </span>
        </motion.div>

        {/* ── Left closing curtain — shows left half of the card face ── */}
        <motion.div
          animate={leftCtrl}
          initial={{ x: "-101%", opacity: 0 }}
          className="absolute top-0 left-0 h-full w-1/2 overflow-hidden rounded-l-2xl"
          style={{ zIndex: 20, boxShadow: "3px 0 20px rgba(0,0,0,0.15)" }}
        >
          <div className={`absolute inset-0 w-[200%] flex flex-col items-center justify-center gap-4 p-6 text-center border ${cardFaceCls}`}>
            <span className="text-5xl">{icon}</span>
            <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{title}</h3>
            <span className={`text-xs font-medium ${isLight ? "text-gray-400" : "text-gray-500"}`}>Click para revelar</span>
          </div>
        </motion.div>

        {/* ── Right closing curtain — shows right half of the card face ── */}
        <motion.div
          animate={rightCtrl}
          initial={{ x: "101%", opacity: 0 }}
          className="absolute top-0 right-0 h-full w-1/2 overflow-hidden rounded-r-2xl"
          style={{ zIndex: 20, boxShadow: "-3px 0 20px rgba(0,0,0,0.15)" }}
        >
          <div className={`absolute top-0 right-0 h-full w-[200%] flex flex-col items-center justify-center gap-4 p-6 text-center border ${cardFaceCls}`}>
            <span className="text-5xl">{icon}</span>
            <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{title}</h3>
            <span className={`text-xs font-medium ${isLight ? "text-gray-400" : "text-gray-500"}`}>Click para revelar</span>
          </div>
        </motion.div>

        {/* ── Push robot — walks inside card (clipped naturally at edges) ── */}
        <motion.div
          animate={pushBotCtrl}
          initial={{ x: -90, opacity: 0, y: 0 }}
          className="absolute bottom-0 left-0 z-50 pointer-events-none"
        >
          <PushRobot walking={phase === "opening"} />
        </motion.div>

      </div>{/* end overflow-hidden card */}

      {/* ── Left arm — grows upward, follows curtain inward ── */}
      <motion.div
        animate={leftArmCtrl}
        initial={{ scaleY: 0, opacity: 0, rotate: -28, x: 0 }}
        className="absolute pointer-events-none"
        style={{
          bottom: 36,
          left: "calc(50% - 34px)",
          width: 8,
          height: 230,
          background: "linear-gradient(to top, #9B5CF8 0%, #3B82F6 100%)",
          borderRadius: 4,
          zIndex: 55,
          transformOrigin: "50% 100%",
        }}
      />
      {/* ── Right arm — grows upward, follows curtain inward ── */}
      <motion.div
        animate={rightArmCtrl}
        initial={{ scaleY: 0, opacity: 0, rotate: 28, x: 0 }}
        className="absolute pointer-events-none"
        style={{
          bottom: 36,
          left: "calc(50% + 26px)",
          width: 8,
          height: 230,
          background: "linear-gradient(to top, #9B5CF8 0%, #3B82F6 100%)",
          borderRadius: 4,
          zIndex: 55,
          transformOrigin: "50% 100%",
        }}
      />

      {/* ── Pull robot — OUTSIDE overflow:hidden so it shows fully ── */}
      <motion.div
        animate={pullBotCtrl}
        initial={{ y: 110, opacity: 0 }}
        className="absolute z-50 pointer-events-none"
        style={{ bottom: 0, left: "50%", marginLeft: -40, zIndex: 60 }}
      >
        <PullRobot pulling={phase === "closing"} />
      </motion.div>

    </div>
  );
}

// ── Section label ─────────────────────────────────────────────────
function SectionLabel({ text, isLight, white = false }: { text: string; isLight: boolean; white?: boolean }) {
  if (white) return (
    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 bg-white/20 text-white">
      {text}
    </span>
  );
  return (
    <span className={`inline-block px-5 py-2 rounded-full text-base font-bold tracking-widest uppercase mb-4 transition-colors duration-500 ${
      isLight ? "bg-brand-magenta/10 text-brand-magenta" : "bg-azul/10 text-azul"
    }`}>{text}</span>
  );
}


// ── Section background helpers ────────────────────────────────────
const lightBg = "bg-white/65 backdrop-blur-[2px]";
const lightAltBg = "bg-gray-50/65 backdrop-blur-[2px]";
const darkBg = "bg-[#060d1a]/72 backdrop-blur-[2px]";
const darkAltBg = "bg-[#08111e]/72 backdrop-blur-[2px]";

function sectionBg(isLight: boolean, alt = false) {
  return isLight ? (alt ? lightAltBg : lightBg) : (alt ? darkAltBg : darkBg);
}

// ════════════════════════════════════════════════════════
// SECTION 1 — HERO
// ════════════════════════════════════════════════════════
function HeroSection({ isLight }: { isLight: boolean }) {
  return (
    <section className={`relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-4 text-center transition-colors duration-500 ${sectionBg(isLight)}`}>
      {/* Gradient orbs */}
      <div className={`absolute top-1/4 -left-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 ${isLight ? "bg-brand-magenta" : "bg-azul"}`} />
      <div className={`absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 ${isLight ? "bg-brand-yellow" : "bg-blue-900"}`} />

      <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight max-w-5xl transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
        Camb
        <span className={isLight
          ? "bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-brand-orange bg-clip-text text-transparent"
          : "bg-gradient-to-r from-[#0070f3] via-blue-300 to-[#0070f3] bg-clip-text text-transparent"}>
          IA
        </span>{" "}el mundo.
        <br />
        Camb
        <span className={isLight
          ? "bg-gradient-to-r from-brand-fuchsia via-brand-magenta to-brand-yellow bg-clip-text text-transparent"
          : "bg-gradient-to-r from-blue-300 via-[#0070f3] to-blue-400 bg-clip-text text-transparent"}>
          IA
        </span>{" "}tu evento.
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35 }}
        className={`relative z-10 mt-6 text-lg sm:text-xl max-w-2xl leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-300"}`}>
        La primera consultora española especializada al 100% en inteligencia artificial
        aplicada al sector MICE. Nacimos en 2024 para transformar la industria de los
        eventos desde el conocimiento profundo del sector.
      </motion.p>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 2 — MANIFESTO
// ════════════════════════════════════════════════════════
function ManifiestoSection({ isLight }: { isLight: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const phrase1 = ["No", "somos", "una", "empresa", "de", "tecnología", "que", "hace", "eventos."];
  const phrase2 = ["Somos", "especialistas", "en", "eventos", "que", "dominan", "la", "IA."];
  const highlight = new Set(["especialistas", "dominan", "IA."]);

  return (
    <section ref={ref} className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${
      isLight
        ? "bg-gradient-to-br from-[#f0a0c0] via-[#dc80c8] to-[#f8c090]"
        : "bg-[#060d1a]/95 backdrop-blur-sm"
    }`}>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className={`text-3xl sm:text-4xl md:text-5xl font-black leading-snug tracking-tight ${isLight ? "text-white" : "text-white"}`}>
          {[...phrase1, ...phrase2].map((word, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.07, ease: "easeOut" }}
              className={`inline-block mr-3 mb-2 ${!isLight && highlight.has(word) ? "text-azul" : ""}
                ${isLight && phrase2.includes(word) ? "opacity-100" : isLight ? "opacity-80" : ""}`}>
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 3 — HISTORIA
// ════════════════════════════════════════════════════════
function HistoriaSection({ isLight }: { isLight: boolean }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const timeline = [
    { year: "2022", icon: "🔬", text: "Guillermo descubre el potencial de los modelos generativos mientras investiga IA en oncología en el Hospital La Paz." },
    { year: "2023", icon: "🌍", text: "Aprende el sector de los eventos desde dentro en Externa Marketing & Events y participa en el Mobile World Congress de Barcelona." },
    { year: "2024", icon: "🚀", text: "Funda Externia. En menos de 2 meses ya colabora con 5 de las principales agencias de eventos de España y proyectos para clientes del IBEX 35." },
    { year: "2025", icon: "🏆", text: "Ganador del premio Event Industry Entrepreneur y finalista del Innovation Champion en los MPI Iberian Awards — Valencia." },
  ];

  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight)}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="mb-16">
          <SectionLabel text="Nuestra Historia" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black leading-tight transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            De la ciencia oncológica
            <br />
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              a revolucionar los eventos
            </span>
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Interactive Timeline */}
          <div>
            {timeline.map((item, i) => (
              <FadeIn key={i} delay={i * 0.12} from="left">
                <motion.div
                  className={`flex gap-5 mb-2 rounded-2xl p-4 cursor-pointer transition-colors duration-300 ${
                    activeIdx === i ? (isLight ? "bg-brand-magenta/8" : "bg-azul/8") : "bg-transparent"
                  }`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseLeave={() => setActiveIdx(null)}
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}>
                  <div className="flex flex-col items-center shrink-0">
                    <motion.div
                      animate={activeIdx === i
                        ? { scale: 1.15, boxShadow: isLight ? "0 0 18px #DE3B8470" : "0 0 18px #0070f370" }
                        : { scale: 1, boxShadow: "0 0 0px transparent" }}
                      transition={{ duration: 0.25 }}
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white transition-colors duration-500 ${isLight ? "bg-brand-magenta" : "bg-azul"}`}>
                      {item.icon}
                    </motion.div>
                    {i < timeline.length - 1 && (
                      <motion.div className={`w-px mt-2 transition-colors duration-500 ${isLight ? "bg-brand-magenta/25" : "bg-azul/25"}`}
                        animate={{ height: activeIdx === i ? 56 : 48 }} transition={{ duration: 0.2 }} />
                    )}
                  </div>
                  <div className="pb-4 pt-1">
                    <span className={`text-xs font-extrabold tracking-widest uppercase transition-colors duration-500 ${isLight ? "text-brand-magenta" : "text-azul"}`}>
                      {item.year}
                    </span>
                    <motion.p animate={{ opacity: activeIdx === i ? 1 : 0.75 }}
                      className={`mt-1.5 text-base leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                      {item.text}
                    </motion.p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          {/* Photos column */}
          <div className="flex flex-col gap-6">
            <FadeIn delay={0.2} from="right">
              <div className="relative">
                <div className={`absolute -inset-3 rounded-3xl blur-2xl opacity-25 pointer-events-none transition-colors duration-500 ${isLight ? "bg-gradient-to-r from-brand-magenta to-brand-yellow" : "bg-azul"}`} />
                <Tilt
                  glareEnable glareMaxOpacity={0.18}
                  glareColor={isLight ? "#DE3B84" : "#0070f3"}
                  glarePosition="all" glareBorderRadius="16px"
                  tiltMaxAngleX={7} tiltMaxAngleY={7}
                  scale={1.02} transitionSpeed={500}
                  className="block">
                  <div className={`relative rounded-2xl overflow-hidden border transition-colors duration-500 ${isLight ? "border-brand-magenta/15" : "border-white/8"}`}>
                    <img src="/team/guillermo-premio.png" alt="Guillermo Prado — MPI Iberian Awards 2025" className="w-full h-[380px] object-cover object-top block" />
                    <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md border transition-colors duration-500 ${isLight ? "bg-white/85 border-brand-magenta/15" : "bg-black/75 border-white/10"}`}>
                      <p className={`text-xs font-bold tracking-widest uppercase transition-colors duration-500 ${isLight ? "text-brand-magenta" : "text-azul"}`}>
                        🏆 MPI Iberian Awards 2025
                      </p>
                      <p className={`text-sm font-semibold mt-0.5 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
                        🥇 Ganador · Event Industry Entrepreneur
                      </p>
                      <p className={`text-xs mt-0.5 transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        Guillermo Prado Vázquez · Fundador Externia
                      </p>
                    </div>
                  </div>
                </Tilt>
              </div>
            </FadeIn>

            <FadeIn delay={0.35} from="right">
              <blockquote className={`p-6 rounded-2xl border italic transition-colors duration-500 ${isLight ? "bg-gradient-to-br from-[#fff5f9] to-[#fff8ee] border-brand-magenta/10" : "bg-[#0d1829]/80 border-white/5 backdrop-blur-sm"}`}>
                <p className={`text-base leading-relaxed font-medium transition-colors duration-500 ${isLight ? "text-gray-800" : "text-gray-200"}`}>
                  "La IA nos permite hacer los eventos más humanos, no menos.
                  Cada activación está diseñada para crear conexión real entre la marca y las personas."
                </p>
                <footer className={`mt-3 text-sm font-bold not-italic transition-colors duration-500 ${isLight ? "text-brand-magenta" : "text-azul"}`}>
                  — Guillermo Prado Vázquez, Fundador de Externia
                </footer>
              </blockquote>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 4 — QUÉ NOS DIFERENCIA
// ════════════════════════════════════════════════════════
function DiferenciasSection({ isLight }: { isLight: boolean }) {
  const features = [
    { icon: "🎯", title: "Especialización exclusiva MICE", desc: "Entendemos los ritmos, necesidades y lenguaje de los eventos mejor que nadie.", lightGrad: "from-[#DE3B84]/8 to-[#D6007D]/4", hoverLight: "hover:border-[#DE3B84]/50" },
    { icon: "✨", title: "Tecnología que no se nota", desc: "Activaciones discretas, fluidas, que generan momentos WOW de forma completamente natural.", lightGrad: "from-[#FFC12D]/8 to-[#F7A361]/4", hoverLight: "hover:border-[#FFC12D]/50" },
    { icon: "❤️", title: "Enfoque en el asistente", desc: "Experiencias hiperpersonalizadas que crean conexión emocional real entre la marca y las personas.", lightGrad: "from-[#EE847B]/8 to-[#DE3B84]/4", hoverLight: "hover:border-[#EE847B]/50" },
    { icon: "🌱", title: "Compromiso sostenible", desc: "Colaboramos con el Sustainability Hub for Events y trabajamos para soluciones neutras en carbono.", lightGrad: "from-[#D6007D]/8 to-[#EE847B]/4", hoverLight: "hover:border-[#D6007D]/50" },
    { icon: "⚖️", title: "Cumplimiento regulatorio", desc: "Operamos en plena conformidad con la Ley de IA de la UE y los más altos estándares de protección de datos.", lightGrad: "from-[#F7A361]/8 to-[#FFC12D]/4", hoverLight: "hover:border-[#F7A361]/50" },
    { icon: "📊", title: "Resultados medibles", desc: "Cada activación genera informes de impacto detallados. La IA no solo impresiona, también demuestra su valor con datos reales.", lightGrad: "from-[#DE3B84]/8 to-[#FFC12D]/4", hoverLight: "hover:border-[#DE3B84]/50" },
  ];

  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight, true)}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <SectionLabel text="Qué nos diferencia" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Experiencias{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              MAPI
            </span>
          </h2>
          <p className={`mt-3 text-base tracking-wide transition-colors duration-500 ${isLight ? "text-gray-400" : "text-gray-500"}`}>
            Medibles · Asequibles · Personalizadas · Innovadoras
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <MagneticRepel key={i} strength={52} radius={185}>
              <FadeIn delay={i * 0.09}>
                <TiltCard className={`group h-full p-7 rounded-2xl border transition-all duration-300 cursor-default ${
                  isLight
                    ? `bg-gradient-to-br ${f.lightGrad} bg-white/90 border-gray-100 ${f.hoverLight} backdrop-blur-sm`
                    : "bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/45 hover:bg-[#00c8ff]/6 backdrop-blur-sm"
                }`}>
                  <MagneticAttract strength={18} radius={82}>
                    <div className="text-4xl mb-5">{f.icon}</div>
                  </MagneticAttract>
                  <h3 className={`text-base font-bold mb-2 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>{f.title}</h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>{f.desc}</p>
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
// SECTION 5 — LO QUE HACEMOS
// ════════════════════════════════════════════════════════
function ServiciosSection({ isLight }: { isLight: boolean }) {
  const services = [
    { icon: "🧠", title: "Consultoría de IA para Eventos", desc: "Acompañamos a agencias y empresas en la integración estratégica de la IA. Identificamos oportunidades, diseñamos hojas de ruta y formamos equipos para que la IA sea una ventaja real.", gradient: "from-[#DE3B84] to-[#D6007D]" },
    { icon: "⚡", title: "Activaciones Hiperpersonalizadas", desc: "Smart Brush (caricaturas IA), transformaciones de avatar, oracle experiences, matchmaking inteligente, tarjetas de visita con IA, photocalls interactivos y mucho más.", gradient: "from-[#FFC12D] to-[#F7A361]" },
    { icon: "📚", title: "Formación Especializada", desc: "Programas adaptados al sector: desde talleres introductorios hasta certificaciones avanzadas. Preparamos a los profesionales para el presente y el futuro.", gradient: "from-[#EE847B] to-[#DE3B84]" },
  ];

  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight)}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <SectionLabel text="Lo que hacemos" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Tres líneas de{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-orange to-brand-magenta bg-clip-text text-transparent"
              : "bg-gradient-to-r from-blue-300 to-azul bg-clip-text text-transparent"}>
              impacto real
            </span>
          </h2>
          <p className={`mt-3 text-sm transition-colors duration-500 ${isLight ? "text-gray-400" : "text-gray-500"}`}>
            Haz click en cada tarjeta para revelar su contenido
          </p>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <FadeIn key={i} delay={i * 0.12}>
              <FlipCard icon={s.icon} title={s.title} desc={s.desc} gradient={s.gradient} isLight={isLight} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 6 — METODOLOGÍA
// ════════════════════════════════════════════════════════
function MetodologiaSection({ isLight }: { isLight: boolean }) {
  const steps = [
    { num: "01", title: "CRE-IA-tividad", desc: "Exploramos el contexto del evento, los objetivos y el perfil de los asistentes para co-crear la solución más adecuada con brainstorming aumentado con IA.", color: isLight ? "#DE3B84" : "#0070f3" },
    { num: "02", title: "AI-mplementación", desc: "Desarrollamos e integramos la solución de forma ágil y eficiente, asegurando que la tecnología se adapte al espacio, el tiempo y el equipo humano.", color: isLight ? "#FFC12D" : "#3b82f6" },
    { num: "03", title: "Evolución y Optimización", desc: "Monitorizamos resultados en tiempo real, recogemos feedback y generamos informes de impacto medibles para cada cliente.", color: isLight ? "#F7A361" : "#60a5fa" },
  ];

  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight, true)}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-20">
          <SectionLabel text="Nuestra Metodología" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Un proceso diseñado para{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta to-brand-orange bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              garantizar resultados
            </span>
          </h2>
        </FadeIn>

        <div className="relative">
          <div className={`hidden lg:block absolute top-10 left-[16.66%] right-[16.66%] h-px transition-colors duration-500 ${isLight ? "bg-gradient-to-r from-brand-magenta via-brand-yellow to-brand-orange" : "bg-gradient-to-r from-azul/40 to-blue-400/40"}`} />
          <div className="grid lg:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.18}>
                <div className="flex flex-col items-center text-center">
                  <motion.div whileHover={{ scale: 1.12 }} transition={{ type: "spring", stiffness: 300 }}
                    className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white mb-6 shadow-xl"
                    style={{ backgroundColor: step.color }}>
                    {step.num}
                    <div className="absolute inset-0 rounded-full opacity-40 blur-md" style={{ backgroundColor: step.color }} />
                  </motion.div>
                  <h3 className={`text-xl font-black mb-3 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
                    {step.title.split("-").map((part, pi, arr) =>
                      part === "IA" ? <span key={pi} style={{ color: step.color }}>IA</span>
                        : <span key={pi}>{part}{pi < arr.length - 1 && "-"}</span>
                    )}
                  </h3>
                  <p className={`text-sm leading-relaxed max-w-xs transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 7 — RESULTADOS
// ════════════════════════════════════════════════════════
function ResultadosSection({ isLight }: { isLight: boolean }) {
  const stats = [
    { value: 2300, suffix: "+", label: "caricaturas generadas por IA en un solo evento", color: "#DE3B84" },
    { value: 600, suffix: "+", label: "asignaciones de asientos automatizadas", color: "#FFC12D" },
    { value: 4800, suffix: "+", label: "conexiones inteligentes de matchmaking", color: "#F7A361" },
    { value: 1200, suffix: "+", label: "registros gestionados con lenguaje natural", color: "#EE847B" },
    { value: 5, suffix: "", label: "grandes agencias españolas en los primeros 2 meses", color: "#D6007D" },
  ];

  const [replays, setReplays] = useState<number[]>([0, 0, 0, 0, 0]);
  const handleClick = (i: number) =>
    setReplays((prev) => prev.map((v, j) => (j === i ? v + 1 : v)));

  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${
      isLight
        ? "bg-gradient-to-br from-[#f0a0c0] via-[#dc80c8] to-[#f8c090]"
        : "bg-[#060d1a]/95 backdrop-blur-sm"
    }`}>

      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <SectionLabel text="Nuestros Resultados" isLight={isLight} white={isLight} />
          <h2 className="text-4xl sm:text-5xl font-black text-white">Nuestros números hablan</h2>
          <p className={`mt-2 text-sm ${isLight ? "text-white/60" : "text-gray-500"}`}>
            Haz clic en cualquier dato para verlo de nuevo
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div
                onClick={() => handleClick(i)}
                className={`p-8 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none active:scale-95 ${
                  isLight
                    ? "bg-white/15 border-white/20 backdrop-blur-sm hover:bg-white/25"
                    : "bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/40 hover:bg-[#00c8ff]/5 backdrop-blur-sm"
                }`}>
                <div className={`text-5xl sm:text-6xl font-black mb-2 ${isLight ? "text-white" : ""}`}
                  style={!isLight ? { color: s.color } : {}}>
                  <Counter value={s.value} suffix={s.suffix} replay={replays[i]} />
                </div>
                <p className={`text-sm leading-snug ${isLight ? "text-white/80" : "text-gray-400"}`}>{s.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 8 — EQUIPO
// ════════════════════════════════════════════════════════
function EquipoSection({ isLight }: { isLight: boolean }) {
  return (
    <section className={`relative py-28 px-4 overflow-hidden transition-colors duration-500 ${sectionBg(isLight, true)}`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn className="text-center mb-16">
          <SectionLabel text="Nuestro Equipo" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Personas que hacen posible la{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul to-blue-300 bg-clip-text text-transparent"}>
              magia
            </span>
          </h2>
          <p className={`mt-4 text-base max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Combinamos perfiles de tecnología, diseño de experiencias, producción de eventos y
            formación, con un denominador común: la convicción de que la IA, bien aplicada,
            puede hacer los eventos más humanos.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-8 items-stretch">
          <FadeIn delay={0.1} from="left" className="lg:col-span-2">
            <Tilt
              glareEnable glareMaxOpacity={0.15}
              glareColor={isLight ? "#DE3B84" : "#0070f3"}
              glarePosition="all" glareBorderRadius="16px"
              tiltMaxAngleX={8} tiltMaxAngleY={8}
              scale={1.02} transitionSpeed={500}
              className="block">
            <div className={`rounded-2xl overflow-hidden border transition-colors duration-500 ${isLight ? "border-brand-magenta/15 bg-white/90 backdrop-blur-sm" : "border-white/8 bg-[#0d1829]/80 backdrop-blur-sm"}`}>
              <div className="relative overflow-hidden h-[280px]">
                <img src="/team/guillermo-ganador.png" alt="Guillermo Prado — Ganador Event Industry Entrepreneur 2025"
                  className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="p-6">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3 transition-colors duration-500 ${isLight ? "bg-brand-magenta/10 text-brand-magenta" : "bg-azul/10 text-azul"}`}>
                  Fundador & CEO
                </div>
                <h3 className={`text-xl font-black transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>Guillermo Prado Vázquez</h3>
                <p className={`mt-2 text-sm leading-relaxed transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  Doctor en Biociencias Moleculares (UAM) · Exinvestigador Hospital La Paz · Especialista en IA aplicada a eventos MICE
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["🥇 Event Industry Entrepreneur — Ganador", "🏆 Innovation Champion — Finalista"].map((b) => (
                    <span key={b} className={`text-xs px-3 py-1 rounded-full font-medium transition-colors duration-500 ${isLight ? "bg-brand-magenta/8 text-brand-magenta border border-brand-magenta/20" : "bg-azul/10 text-azul border border-azul/20"}`}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            </Tilt>
          </FadeIn>

          <FadeIn delay={0.25} from="right" className="lg:col-span-3 flex flex-col justify-between gap-6">
            <Tilt
              glareEnable glareMaxOpacity={0.15}
              glareColor={isLight ? "#DE3B84" : "#0070f3"}
              glarePosition="all" glareBorderRadius="16px"
              tiltMaxAngleX={6} tiltMaxAngleY={6}
              scale={1.02} transitionSpeed={500}
              className="block">
              <div className={`relative rounded-2xl overflow-hidden border transition-colors duration-500 ${isLight ? "border-brand-magenta/15" : "border-white/8"}`}>
                <img src="/team/equipo-mpi.png" alt="Equipo Externia en MPI Iberian Chapter"
                  className="w-full h-[420px] object-cover object-center transition-transform duration-700 hover:scale-105" />
                <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md border transition-colors duration-500 ${isLight ? "bg-white/85 border-brand-magenta/15" : "bg-black/75 border-white/10"}`}>
                  <p className={`text-xs font-bold tracking-widest uppercase transition-colors duration-500 ${isLight ? "text-brand-magenta" : "text-azul"}`}>
                    MPI Iberian Chapter · Valencia 2025
                  </p>
                  <p className={`text-sm mt-0.5 transition-colors duration-500 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Equipo Externia en el Global Meetings Industry Day
                  </p>
                </div>
              </div>
            </Tilt>

            <div className="grid grid-cols-3 gap-4">
              {[{ icon: "🔬", label: "Rigor analítico" }, { icon: "💡", label: "Creatividad disruptiva" }, { icon: "🤝", label: "Respeto por las personas" }].map((v) => (
                <div key={v.label} className={`p-4 rounded-xl text-center border transition-all duration-300 hover:-translate-y-1 ${isLight ? "bg-white/90 border-gray-100 backdrop-blur-sm" : "bg-[#0d1829]/80 border-white/5 hover:border-[#00c8ff]/40 hover:bg-[#00c8ff]/5 backdrop-blur-sm"}`}>
                  <MagneticAttract strength={18} radius={65}>
                    <div className="text-2xl mb-2">{v.icon}</div>
                  </MagneticAttract>
                  <p className={`text-xs font-semibold transition-colors duration-500 ${isLight ? "text-gray-700" : "text-gray-300"}`}>{v.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// SECTION 9 — CTA
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
          <SectionLabel text="¿Listo para el cambio?" isLight={isLight} />
          <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 transition-colors duration-500 ${isLight ? "text-gray-900" : "text-white"}`}>
            Transforma tu próximo evento con{" "}
            <span className={isLight
              ? "bg-gradient-to-r from-brand-magenta via-brand-fuchsia to-brand-orange bg-clip-text text-transparent"
              : "bg-gradient-to-r from-azul via-blue-300 to-azul bg-clip-text text-transparent"}>
              Inteligencia Artificial
            </span>
          </h2>
          <p className={`text-lg mb-10 transition-colors duration-500 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Descubre cómo Externia puede crear una experiencia MAPI para tu próximo evento.
          </p>

          <motion.a href="/servicios" whileTap={{ scale: 0.97 }}
            onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}
            className={`relative inline-block overflow-hidden px-12 py-5 rounded-full text-lg font-bold text-white transition-shadow duration-300 ${isLight ? "bg-gradient-to-r from-brand-magenta to-brand-fuchsia" : "bg-azul"}`}
            style={hovered ? { boxShadow: isLight ? "0 0 50px #DE3B8490, 0 0 100px #D6007D40" : "0 0 50px #0070f390, 0 0 100px #0070f340" } : {}}>
            {/* Invisible spacer keeps button width stable */}
            <span className="invisible whitespace-nowrap">Ver nuestros servicios →</span>
            {/* Primary — starts centered, exits right on hover, returns from left on leave */}
            <span ref={primaryRef} aria-hidden
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
              style={{ transform: "translateX(0%)" }}>
              Ver nuestros servicios →
            </span>
            {/* Clone — starts off-screen left, enters from left on hover, exits right on leave */}
            <span ref={cloneRef} aria-hidden
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
              style={{ transform: "translateX(-110%)" }}>
              Ver nuestros servicios →
            </span>
          </motion.a>
        </FadeIn>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// INTERACTIVE PHYSICS HELPERS
// ════════════════════════════════════════════════════════

/** Wraps children and REPELS them away from the cursor when it gets close */
function MagneticRepel({
  children, strength = 32, radius = 170,
}: { children: React.ReactNode; strength?: number; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 18 });
  const sy = useSpring(y, { stiffness: 160, damping: 18 });

  useEffect(() => {
    _ensureGlobalMouse();
    const cb = (mx: number, my: number) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = mx - (r.left + r.width * 0.5);
      const dy = my - (r.top + r.height * 0.5);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius && dist > 0) {
        const force = (1 - dist / radius) * strength;
        x.set((-dx / dist) * force);
        y.set((-dy / dist) * force);
      } else {
        x.set(0); y.set(0);
      }
    };
    _gMouseSubs.add(cb);
    return () => { _gMouseSubs.delete(cb); };
  }, [strength, radius]);

  return <motion.div ref={ref} style={{ x: sx, y: sy }}>{children}</motion.div>;
}

/** Wraps children and ATTRACTS them toward the cursor when it gets close */
function MagneticAttract({
  children, strength = 14, radius = 75,
}: { children: React.ReactNode; strength?: number; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });

  useEffect(() => {
    _ensureGlobalMouse();
    const cb = (mx: number, my: number) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = mx - (r.left + r.width * 0.5);
      const dy = my - (r.top + r.height * 0.5);
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius && dist > 0) {
        const force = (1 - dist / radius) * strength;
        x.set((dx / dist) * force);
        y.set((dy / dist) * force);
      } else {
        x.set(0); y.set(0);
      }
    };
    _gMouseSubs.add(cb);
    return () => { _gMouseSubs.delete(cb); };
  }, [strength, radius]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: "inline-block" }}>
      {children}
    </motion.div>
  );
}

/** tsparticles network background — AI / connection lines theme */
function NetworkParticlesBg({ isLight }: { isLight: boolean }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);


  if (!ready) return null;

  const accent = isLight ? "#DE3B84" : "#0070f3";

  return (
    <Particles
      id="qs-network"
      style={{ position: "fixed", inset: 0, zIndex: 5, pointerEvents: "none" }}
      options={{
        fpsLimit: 40,
        background: { color: { value: "transparent" } },
        interactivity: {
          detectsOn: "window" as const,
          events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            repulse: { distance: 100, duration: 0.4, factor: 3 },
            push: { quantity: 1 },
          },
        },
        particles: {
          color: { value: accent },
          links: {
            enable: true,
            color: accent,
            opacity: isLight ? 0.58 : 1.0,
            distance: 130,
            width: 1.8,
          },
          move: {
            enable: true,
            speed: 0.6,
            random: true,
            direction: "none" as const,
            outModes: { default: "bounce" as const },
          },
          number: {
            density: { enable: true, area: 900 },
            value: 50,
          },
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
// ROOT EXPORT
// ════════════════════════════════════════════════════════
export default function QuienesSomos() {
  const isLight = useTheme();

  return (
    <>
      {/* Floating bubbles background — brand color (light) / blue (dark) */}
      <BubblesBg isLight={isLight} />

      {/* AI / network particles — connection lines, mouse repulsion */}
      <NetworkParticlesBg isLight={isLight} />

      {/* All page sections sit above the canvas */}
      <div className="relative z-10 transition-colors duration-500">
        <HeroSection isLight={isLight} />
        <ManifiestoSection isLight={isLight} />
        <HistoriaSection isLight={isLight} />
        <DiferenciasSection isLight={isLight} />
        <ServiciosSection isLight={isLight} />
        <MetodologiaSection isLight={isLight} />
        <ResultadosSection isLight={isLight} />
        <EquipoSection isLight={isLight} />
        <CTASection isLight={isLight} />
      </div>
    </>
  );
}
