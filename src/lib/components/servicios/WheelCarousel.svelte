<script lang="ts">
  export interface FlickCardData {
    emoji: string;
    category: string;
    title: string;
    desc: string;
    ideal: string;
    gradientLight: string;
    gradientDark: string;
  }

  let { cards, isLight }: { cards: FlickCardData[]; isLight: boolean } = $props();

  const CARD_W = 600;
  const CARD_H = 630;
  const X_SPREAD = 760;
  const ROT_DEG = 18;
  const Y_ARC = 180;
  const SCALE_OFF = 0.17;
  const FRICTION = 0.88;
  const PX_PER_CARD = 260;

  const n = $derived(cards.length);

  let offset = $state(0);
  let offsetRef = 0;
  let startOffsetRef = 0;
  let dragStartX = 0;
  let lastX = 0;
  let lastT = 0;
  let dragVel = 0;
  let isDragging = false;
  let rafId = 0;

  function wrappedPos(rawPos: number, num: number): number {
    return ((rawPos + num / 2) % num + num) % num - num / 2;
  }

  function sync(v: number) {
    offsetRef = v;
    offset = v;
  }

  function snapTo(from: number) {
    const target = Math.round(from);
    let cur = from;
    const run = () => {
      cur += (target - cur) * 0.2;
      if (Math.abs(cur - target) < 0.003) {
        sync(target);
        return;
      }
      sync(cur);
      rafId = requestAnimationFrame(run);
    };
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(run);
  }

  function applyMomentum(velCards: number, from: number) {
    let vel = velCards;
    let cur = from;
    const run = () => {
      vel *= FRICTION;
      cur += vel;
      sync(cur);
      if (Math.abs(vel) > 0.01) {
        rafId = requestAnimationFrame(run);
      } else {
        snapTo(cur);
      }
    };
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(run);
  }

  function jumpTo(idx: number) {
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
    const diff = wrappedPos(idx - offsetRef, n);
    const target = offsetRef + diff;
    let cur = offsetRef;
    const run = () => {
      cur += (target - cur) * 0.18;
      if (Math.abs(cur - target) < 0.003) {
        sync(target);
        return;
      }
      sync(cur);
      rafId = requestAnimationFrame(run);
    };
    rafId = requestAnimationFrame(run);
  }

  function onDown(e: PointerEvent) {
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
    isDragging = true;
    startOffsetRef = offsetRef;
    dragStartX = e.clientX;
    lastX = e.clientX;
    lastT = performance.now();
    dragVel = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onMove(e: PointerEvent) {
    if (!isDragging) return;
    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) dragVel = (e.clientX - lastX) / dt;
    lastX = e.clientX;
    lastT = now;
    sync(startOffsetRef - (e.clientX - dragStartX) / PX_PER_CARD);
  }

  function onUp() {
    if (!isDragging) return;
    isDragging = false;
    const velCards = -(dragVel * (1000 / 60)) / PX_PER_CARD;
    Math.abs(velCards) > 0.08 ? applyMomentum(velCards, offsetRef) : snapTo(offsetRef);
  }

  import { onDestroy } from 'svelte';
  onDestroy(() => {
    if (typeof cancelAnimationFrame !== 'undefined' && rafId) cancelAnimationFrame(rafId);
  });

  const centeredIdx = $derived((((Math.round(offset) % n) + n) % n));
  const current = $derived(cards[centeredIdx]);
</script>

<div class="flex flex-col items-center gap-6 select-none w-full">
  <!-- Title tabs -->
  <div class="flex flex-wrap justify-center gap-2 px-4 max-w-3xl">
    {#each cards as card, i}
      <button
        type="button"
        onclick={() => jumpTo(i)}
        class="px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 {i === centeredIdx ? (isLight ? 'bg-brand-magenta text-white border-brand-magenta' : 'bg-azul text-white border-azul') : (isLight ? 'bg-white/60 text-gray-600 border-gray-200 hover:opacity-80' : 'bg-white/5 text-gray-400 border-white/10 hover:opacity-80')}"
        style="opacity: {i === centeredIdx ? 1 : 0.4}; transform: scale({i === centeredIdx ? 1 : 0.93})"
      >
        {card.emoji} {card.title}
      </button>
    {/each}
  </div>

  <!-- Category label -->
  {#key current.title}
    <p class="text-xs font-bold tracking-widest uppercase {isLight ? 'text-brand-magenta' : 'text-azul'}">
      {current.category}
    </p>
  {/key}

  <!-- Wheel -->
  <div class="relative w-full overflow-visible touch-none" style="height: {CARD_H + 220}px">
    <div
      class="absolute cursor-grab active:cursor-grabbing"
      style="top: 0; bottom: 0; left: 50%; transform: translateX(-50%); width: 100vw; z-index: 60"
      onpointerdown={onDown}
      onpointermove={onMove}
      onpointerup={onUp}
      onpointercancel={onUp}
      role="presentation"
    ></div>
    {#each cards as card, i}
      {@const pos = wrappedPos(i - offset, n)}
      {@const abs = Math.abs(pos)}
      <div
        class="rounded-[24px] overflow-hidden pointer-events-none"
        style="
          width: {CARD_W}px;
          height: {CARD_H}px;
          position: absolute;
          left: calc(50% - {CARD_W / 2}px);
          top: 30px;
          z-index: {Math.round(30 - abs * 8)};
          transform: translateX({pos * X_SPREAD}px) translateY({abs * abs * Y_ARC}px) rotate({pos * ROT_DEG}deg) scale({Math.max(0.55, 1 - abs * SCALE_OFF)});
          opacity: {abs > 1.7 ? 0 : Math.max(0.4, 1 - abs * 0.45)};
          will-change: transform, opacity;
        "
      >
        <div class="h-full flex flex-col justify-between p-8 bg-gradient-to-br {isLight ? card.gradientLight : card.gradientDark}">
          <div>
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-5 bg-white/20 text-white">
              {card.category}
            </span>
            <div class="text-7xl mb-5">{card.emoji}</div>
            <h3 class="text-2xl font-black text-white mb-3">{card.title}</h3>
            <p class="text-white/90 text-sm leading-relaxed">{card.desc}</p>
          </div>
          <div>
            <div class="h-px bg-white/20 mb-4"></div>
            <p class="text-white/80 text-xs leading-relaxed">
              <span class="font-bold text-white">Ideal para:</span> {card.ideal}
            </p>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
