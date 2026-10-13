export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Maps p from the [a, b] window to 0..1 */
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

/** Progress through a pinned chapter: 0 when it pins, 1 when it releases */
export const pinProgress = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  return clamp(-r.top / Math.max(1, r.height - innerHeight));
};

/**
 * Runs `fn` once per frame while scrolling, but only while `el` is on screen.
 * Returns a cleanup function.
 */
export function whileVisible(el: HTMLElement, fn: () => void) {
  let raf = 0;
  const tick = () => { raf = 0; fn(); };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('resize', onScroll);
      onScroll();
    } else {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    }
  });
  io.observe(el);
  return () => {
    io.disconnect();
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', onScroll);
    if (raf) cancelAnimationFrame(raf);
  };
}
