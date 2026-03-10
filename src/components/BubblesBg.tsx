/**
 * BubblesBg.tsx — Shared interactive canvas bubbles.
 * Optimized: fewer bubbles on mobile, optional frame throttle.
 */
import { useRef, useEffect, useState } from "react";

type BubbleData = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  baseVy: number;
  opacity: number;
  phase: number;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setMobile(mq.matches);
    const fn = () => setMobile(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return mobile;
}

export default function BubblesBg({ isLight }: { isLight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const bubblesRef = useRef<BubbleData[]>([]);
  const rafRef = useRef(0);
  const frameCountRef = useRef(0);
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();

  const N = reduced ? 8 : mobile ? 14 : 20;
  const throttleFrames = mobile || reduced ? 2 : 1;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = canvas.width;
    const H = canvas.height;
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
  }, [N]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const [cr, cg, cb] = isLight ? [222, 59, 132] : [40, 120, 255];

    const tick = () => {
      if (!canvas.width || !canvas.height) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      frameCountRef.current++;
      if (frameCountRef.current % throttleFrames !== 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;
      const t = Date.now() * 0.001;

      for (const b of bubblesRef.current) {
        const dx = b.x - mx;
        const dy = b.y - my;
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

        const fill = ctx.createRadialGradient(
          b.x - b.r * 0.28, b.y - b.r * 0.28, 0,
          b.x, b.y, b.r
        );
        fill.addColorStop(0, `rgba(${cr},${cg},${cb},${glow * 0.09})`);
        fill.addColorStop(0.55, `rgba(${cr},${cg},${cb},${glow * 0.04})`);
        fill.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();

        if (proximity > 0.04) {
          const halo = ctx.createRadialGradient(
            b.x, b.y, b.r * 0.85, b.x, b.y, b.r * 1.7
          );
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
