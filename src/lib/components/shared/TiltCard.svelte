<script lang="ts">
  interface Props {
    className?: string;
  }

  let { className = '' }: Props = $props();

  let el: HTMLDivElement;
  let transform = $state('perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
  let transition = $state('transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)');

  function onMove(e: MouseEvent) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -18;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 18;
    transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
    transition = 'transform 0.12s ease';
  }

  function onLeave() {
    transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    transition = 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)';
  }
</script>

<div
  bind:this={el}
  onmousemove={onMove}
  onmouseleave={onLeave}
  class={className}
  style="transform: {transform}; transition: {transition}"
>
  <slot />
</div>
