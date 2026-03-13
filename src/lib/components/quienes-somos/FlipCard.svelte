<script lang="ts">
  import { onMount } from 'svelte';
  import { spring, tweened } from 'svelte/motion';
  import PushRobot from './PushRobot.svelte';
  import PullRobot from './PullRobot.svelte';

  interface Props {
    icon: string;
    title: string;
    desc: string;
    gradient: string;
    isLight: boolean;
    variant?: 'default' | 'large';
  }

  let { icon, title, desc, gradient, isLight, variant = 'default' }: Props = $props();

  let stageRef: HTMLDivElement;
  let cardWidth = $state(400);
  let cardHeight = $state(288);

  onMount(() => {
    const el = stageRef;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        if (width > 0 && height > 0) {
          cardWidth = width;
          cardHeight = height;
        }
      }
    });
    ro.observe(el);
    cardWidth = el.offsetWidth;
    cardHeight = el.offsetHeight;
    return () => ro.disconnect();
  });

  const walkEndX = $derived(Math.max(350, cardWidth - 80));

  type Phase = 'idle' | 'opening' | 'open' | 'closing';
  let phase = $state<Phase>('idle');
  let busy = $state(false);

  // Main curtain (opening)
  let curtainX = tweened(0, { duration: 0 });
  let curtainOpacity = $state(1);

  // Closing curtains (left/right halves)
  let leftX = tweened(-101, { duration: 0 });
  let rightX = tweened(101, { duration: 0 });
  let leftOpacity = $state(0);
  let rightOpacity = $state(0);

  // Push robot
  let pushX = $state(-90);
  let pushY = $state(0);
  let pushOpacity = $state(0);

  // Pull robot
  let pullY = $state(110);
  let pullOpacity = $state(0);

  // Arm bars (for closing)
  let leftArmScaleY = tweened(0, { duration: 0 });
  let leftArmRotate = tweened(-28, { duration: 0 });
  let leftArmOpacity = tweened(0, { duration: 0 });
  let rightArmScaleY = tweened(0, { duration: 0 });
  let rightArmRotate = tweened(28, { duration: 0 });
  let rightArmOpacity = tweened(0, { duration: 0 });

  // Back content scale
  let backScale = $state(0.7);
  let backOpacity = $state(0);

  const cardFaceCls = $derived(isLight
    ? 'bg-white/90 border-gray-100 shadow-card-light shadow-card-light-hover backdrop-blur-sm'
    : 'bg-[#0d1829]/90 border-white/8 backdrop-blur-sm');

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  async function doOpen() {
    phase = 'opening';
    busy = true;

    // 1. Robot pops in from left
    curtainX.set(0, { duration: 0 });
    pushX = -90;
    pushY = 0;
    pushOpacity = 0;

    const springIn = spring(-90, { stiffness: 0.26, damping: 0.22 });
    const unsubPush = springIn.subscribe((v) => {
      pushX = v;
      pushOpacity = 1;
    });
    springIn.set(-15);
    await sleep(420);
    unsubPush();

    // 2. Robot walks + curtain follows
    const walkDuration = 2000;
    const start = performance.now();
    const waddleY = [0, -7, 0, -7, 0, -7, 0, -7, 0, -7, 0];

    curtainX.set(110, { duration: 1920, delay: 80 });

    function walkFrame(t: number) {
      if (t >= 1) return;
      const progress = t;
      pushX = -15 + progress * (walkEndX - -15);
      const yi = Math.min(Math.floor(progress * waddleY.length), waddleY.length - 1);
      pushY = waddleY[yi] ?? 0;
      requestAnimationFrame(() => walkFrame((performance.now() - start) / walkDuration));
    }
    requestAnimationFrame(() => walkFrame(0));

    await sleep(walkDuration);

    pushX = -90;
    pushOpacity = 0;
    pushY = 0;
    curtainX.set(110, { duration: 0 });
    phase = 'open';
    busy = false;
  }

  async function doClose() {
    phase = 'closing';
    busy = true;

    leftX.set(-101, { duration: 0 });
    rightX.set(101, { duration: 0 });
    leftOpacity = 1;
    rightOpacity = 1;
    leftArmScaleY.set(0, { duration: 0 });
    leftArmRotate.set(-28, { duration: 0 });
    leftArmOpacity.set(0, { duration: 0 });
    rightArmScaleY.set(0, { duration: 0 });
    rightArmRotate.set(28, { duration: 0 });
    rightArmOpacity.set(0, { duration: 0 });

    // 1. Pull robot springs up
    pullY = 110;
    pullOpacity = 0;
    const pullSpring = spring(110, { stiffness: 0.22, damping: 0.2 });
    const unsubPull = pullSpring.subscribe((v) => {
      pullY = v;
      pullOpacity = 1;
    });
    pullSpring.set(0);
    await sleep(500);
    unsubPull();

    // 2. Tug animation (runs in parallel with arm grow)
    const tugY = [0, -12, 3, -9, 2, -6, 0];
    const tugDuration = 1100;
    const tugTween = tweened(0, { duration: tugDuration });
    tugTween.set(1, { duration: tugDuration });
    const unsubTug = tugTween.subscribe((t) => {
      const i = Math.min(Math.floor(t * (tugY.length - 1)), tugY.length - 1);
      pullY = tugY[i] ?? 0;
    });

    // 3. Arms grow (parallel with tug)
    leftArmScaleY.set(1, { duration: 280 });
    leftArmOpacity.set(1, { duration: 280 });
    rightArmScaleY.set(1, { duration: 280 });
    rightArmOpacity.set(1, { duration: 280 });
    await sleep(1100);
    unsubTug();

    // 4. Curtains close + arms retract
    leftX.set(0, { duration: 1500 });
    rightX.set(0, { duration: 1500 });
    leftArmRotate.set(-4, { duration: 1500 });
    leftArmScaleY.set(0, { duration: 1500 });
    leftArmOpacity.set(0, { duration: 1500 });
    rightArmRotate.set(4, { duration: 1500 });
    rightArmScaleY.set(0, { duration: 1500 });
    rightArmOpacity.set(0, { duration: 1500 });
    await sleep(1550);

    // 5. Robot drops
    pullY = 0;
    const dropTween = tweened(0, { duration: 320 });
    dropTween.set(1, { duration: 320 });
    const unsubDrop = dropTween.subscribe((t) => {
      pullY = t * 110;
      pullOpacity = 1 - t;
    });
    await sleep(350);
    unsubDrop();

    // Reset
    curtainX.set(0, { duration: 0 });
    leftX.set(-101, { duration: 0 });
    rightX.set(101, { duration: 0 });
    leftOpacity = 0;
    rightOpacity = 0;
    pullY = 110;
    pullOpacity = 0;
    leftArmScaleY.set(0, { duration: 0 });
    leftArmRotate.set(-28, { duration: 0 });
    leftArmOpacity.set(0, { duration: 0 });
    rightArmScaleY.set(0, { duration: 0 });
    rightArmRotate.set(28, { duration: 0 });
    rightArmOpacity.set(0, { duration: 0 });

    phase = 'idle';
    busy = false;
  }

  function handleClick() {
    if (busy) return;
    if (phase === 'idle') doOpen();
    else if (phase === 'open') doClose();
  }

  $effect(() => {
    if (phase === 'open') {
      backScale = 1;
      backOpacity = 1;
    } else {
      backScale = 0.7;
      backOpacity = 0;
    }
  });
</script>

<div
  class="relative cursor-pointer overflow-hidden rounded-2xl"
  role="button"
  tabindex="0"
  onclick={handleClick}
  onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
  <div bind:this={stageRef} class="relative overflow-hidden rounded-2xl {variant === 'large' ? 'h-96' : 'h-72'}">
    <!-- Back layer: revealed content -->
    <div
      class="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 p-6 text-center bg-gradient-to-br {gradient}"
    >
      <div
        class="flex flex-col items-center gap-3 transition-all duration-[420ms]"
        style="transform: scale({backScale}); opacity: {backOpacity}; transition-delay: {phase === 'open' ? '100ms' : '0ms'}"
      >
        <h3 class="{variant === 'large' ? 'text-3xl' : 'text-xl'} font-bold text-white">{title}</h3>
        <p class="{variant === 'large' ? 'text-lg' : 'text-sm'} text-white/95 leading-relaxed">{desc}</p>
        <span class="{variant === 'large' ? 'text-sm' : 'text-xs'} text-white/60 mt-1">Click para cerrar</span>
      </div>
    </div>

    <!-- Main front curtain -->
    <div
      class="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 p-6 text-center border transition-colors duration-500 {cardFaceCls}"
      style="transform: translateX({$curtainX}%); will-change: transform; z-index: 10"
    >
      <span class="{variant === 'large' ? 'text-6xl' : 'text-5xl'}">{icon}</span>
      <h3 class="{variant === 'large' ? 'text-xl' : 'text-lg'} font-bold transition-colors duration-500 {isLight ? 'text-gray-900' : 'text-white'}">
        {title}
      </h3>
      <span class="{variant === 'large' ? 'text-sm' : 'text-xs'} font-medium transition-colors duration-500 {isLight ? 'text-gray-400' : 'text-gray-500'}">
        Click para revelar
      </span>
    </div>

    <!-- Left closing curtain -->
    <div
      class="absolute top-0 left-0 h-full w-1/2 overflow-hidden rounded-l-2xl"
      style="transform: translateX({$leftX}%); opacity: {leftOpacity}; z-index: 20; box-shadow: 3px 0 20px rgba(0,0,0,0.15)"
    >
      <div class="absolute inset-0 w-[200%] flex flex-col items-center justify-center gap-4 p-6 text-center border {cardFaceCls}">
        <span class="{variant === 'large' ? 'text-6xl' : 'text-5xl'}">{icon}</span>
        <h3 class="{variant === 'large' ? 'text-xl' : 'text-lg'} font-bold {isLight ? 'text-gray-900' : 'text-white'}">{title}</h3>
        <span class="{variant === 'large' ? 'text-sm' : 'text-xs'} font-medium {isLight ? 'text-gray-400' : 'text-gray-500'}">Click para revelar</span>
      </div>
    </div>

    <!-- Right closing curtain -->
    <div
      class="absolute top-0 right-0 h-full w-1/2 overflow-hidden rounded-r-2xl"
      style="transform: translateX({$rightX}%); opacity: {rightOpacity}; z-index: 20; box-shadow: -3px 0 20px rgba(0,0,0,0.15)"
    >
      <div class="absolute top-0 right-0 h-full w-[200%] flex flex-col items-center justify-center gap-4 p-6 text-center border {cardFaceCls}">
        <span class="{variant === 'large' ? 'text-6xl' : 'text-5xl'}">{icon}</span>
        <h3 class="{variant === 'large' ? 'text-xl' : 'text-lg'} font-bold {isLight ? 'text-gray-900' : 'text-white'}">{title}</h3>
        <span class="{variant === 'large' ? 'text-sm' : 'text-xs'} font-medium {isLight ? 'text-gray-400' : 'text-gray-500'}">Click para revelar</span>
      </div>
    </div>

    <!-- Push robot -->
    <div
      class="absolute bottom-0 left-0 z-50 pointer-events-none"
      style="transform: translate({pushX}px, {pushY}px); opacity: {pushOpacity}"
    >
      <PushRobot walking={phase === 'opening'} />
    </div>
  </div>

  <!-- Left arm bar (8px at shoulder, 16px at hand) -->
  <div
    class="absolute pointer-events-none arm-with-hand"
    style="
      bottom: 48px;
      left: calc(50% - 42px);
      width: 16px;
      height: 230px;
      background: linear-gradient(to top, #9B5CF8 0%, #3B82F6 100%);
      z-index: 55;
      transform-origin: 50% 100%;
      transform: scaleY({$leftArmScaleY}) rotate({$leftArmRotate}deg);
      opacity: {$leftArmOpacity};
    "
  ></div>

  <!-- Right arm bar (8px at shoulder, 16px at hand) -->
  <div
    class="absolute pointer-events-none arm-with-hand"
    style="
      bottom: 48px;
      left: calc(50% + 22px);
      width: 16px;
      height: 230px;
      background: linear-gradient(to top, #9B5CF8 0%, #3B82F6 100%);
      z-index: 55;
      transform-origin: 50% 100%;
      transform: scaleY({$rightArmScaleY}) rotate({$rightArmRotate}deg);
      opacity: {$rightArmOpacity};
    "
  ></div>

  <!-- Pull robot -->
  <div
    class="absolute z-50 pointer-events-none"
    style="bottom: 0; left: 50%; margin-left: -40px; z-index: 60; transform: translateY({pullY}px); opacity: {pullOpacity}"
  >
    <PullRobot pulling={phase === 'closing'} />
  </div>
</div>

<style>
  .arm-with-hand {
    clip-path: polygon(4px 100%, 12px 100%, 16px 0, 0 0);
    border-radius: 4px;
  }
</style>
