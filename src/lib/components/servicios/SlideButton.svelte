<script lang="ts">
  let { href, label, isLight, icon }: { href: string; label: string; isLight: boolean; icon: string } = $props();

  let hovered = $state(false);
  let primaryRef: HTMLSpanElement;
  let cloneRef: HTMLSpanElement;
  const TR = 'transform 0.5s cubic-bezier(0.65, 0, 0.35, 1)';

  const text = $derived(`${icon} ${label}`);

  function onEnter() {
    hovered = true;
    if (!primaryRef || !cloneRef) return;
    primaryRef.style.transition = 'none';
    primaryRef.style.transform = 'translateX(0%)';
    cloneRef.style.transition = 'none';
    cloneRef.style.transform = 'translateX(-110%)';
    primaryRef.getBoundingClientRect();
    primaryRef.style.transition = TR;
    primaryRef.style.transform = 'translateX(110%)';
    cloneRef.style.transition = TR;
    cloneRef.style.transform = 'translateX(0%)';
  }

  function onLeave() {
    hovered = false;
    if (!primaryRef || !cloneRef) return;
    primaryRef.style.transition = 'none';
    primaryRef.style.transform = 'translateX(-110%)';
    cloneRef.style.transition = 'none';
    cloneRef.style.transform = 'translateX(0%)';
    cloneRef.getBoundingClientRect();
    cloneRef.style.transition = TR;
    cloneRef.style.transform = 'translateX(110%)';
    primaryRef.style.transition = TR;
    primaryRef.style.transform = 'translateX(0%)';
  }

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<a
  {href}
  onclick={handleClick}
  onmouseenter={onEnter}
  onmouseleave={onLeave}
  class="micro-active-press relative inline-block overflow-hidden px-6 py-2.5 rounded-full text-sm font-semibold border transition-all duration-300 {isLight
    ? 'border-brand-magenta/30 text-brand-magenta bg-brand-magenta/5 hover:bg-brand-magenta/12 hover:border-brand-magenta/60'
    : 'border-azul/30 text-azul bg-azul/5 hover:bg-azul/12 hover:border-azul/60'}"
  style={hovered ? (isLight ? 'box-shadow: 0 0 20px #DE3B8430' : 'box-shadow: 0 0 20px #0070f330') : ''}
>
  <span class="invisible whitespace-nowrap">{text}</span>
  <span bind:this={primaryRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(0%)">{text}</span>
  <span bind:this={cloneRef} aria-hidden="true" class="absolute inset-0 flex items-center justify-center whitespace-nowrap" style="transform: translateX(-110%)">{text}</span>
</a>
