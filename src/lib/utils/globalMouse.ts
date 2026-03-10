/** RAF-batched global mouse tracker — one listener for all magnetic elements */
let _mx = -9999;
let _my = -9999;
let _raf = false;
let _init = false;
const _subs = new Set<(x: number, y: number) => void>();

function _tick() {
  _raf = false;
  _subs.forEach((fn) => fn(_mx, _my));
}

export function ensureGlobalMouse() {
  if (_init || typeof window === 'undefined') return;
  _init = true;
  window.addEventListener(
    'mousemove',
    (e) => {
      _mx = e.clientX;
      _my = e.clientY;
      if (!_raf) {
        _raf = true;
        requestAnimationFrame(_tick);
      }
    },
    { passive: true }
  );
}

export function subscribe(cb: (x: number, y: number) => void) {
  ensureGlobalMouse();
  _subs.add(cb);
  return () => _subs.delete(cb);
}
