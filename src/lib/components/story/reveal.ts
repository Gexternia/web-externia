/** Svelte action: adds `.in` the first time the element scrolls into view. */
export function reveal(node: HTMLElement, opts: { margin?: string } = {}) {
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        node.classList.add('in');
        io.disconnect();
      }
    },
    { rootMargin: opts.margin ?? '0px 0px -12% 0px' }
  );
  io.observe(node);
  return { destroy: () => io.disconnect() };
}

/** Svelte action: sets `--vp` (0..1) as the element travels through the viewport. */
export function viewProgress(node: HTMLElement) {
  let raf = 0;
  const tick = () => {
    raf = 0;
    const r = node.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (r.height + innerHeight)));
    node.style.setProperty('--vp', p.toFixed(4));
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
    else removeEventListener('scroll', onScroll);
  });
  io.observe(node);
  return { destroy: () => { io.disconnect(); removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); } };
}
