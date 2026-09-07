<script lang="ts">
  interface Props {
    name: string;
    class?: string;
    size?: number | string;
  }

  let { name, class: className = 'w-5 h-5', size }: Props = $props();
  let customStyle = $derived(size ? `width: ${typeof size === 'number' ? `${size}px` : size}; height: ${typeof size === 'number' ? `${size}px` : size};` : '');
</script>

{#if name === 'rocket'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
{:else if name === 'lightbulb' || name === 'bulb'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
{:else if name === 'trophy'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
  </svg>
{:else if name === 'medal'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="14" r="5"/>
    <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/>
    <path d="M15.5 9.5 19 3H5l3.5 6.5"/>
  </svg>
{:else if name === 'brain'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M12 5v13"/>
    <path d="M9.5 9A2.5 2.5 0 0 1 12 6.5"/>
    <path d="M14.5 9A2.5 2.5 0 0 0 12 6.5"/>
  </svg>
{:else if name === 'zap'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
{:else if name === 'book'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
  </svg>
{:else if name === 'handshake'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-4.3-4.3a1 1 0 0 0-1.4 0l-2 2"/>
    <path d="m7.3 15.7-4.3-4.3a1 1 0 0 1 0-1.4l4.3-4.3a1 1 0 0 1 1.4 0l2 2"/>
    <path d="M18 4a3 3 0 0 1 3 3v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7a3 3 0 0 1 1-3z"/>
    <path d="M6 20a3 3 0 0 1-3-3v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a3 3 0 0 1-1 3z"/>
  </svg>
{:else if name === 'microscope'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 18h8"/>
    <path d="M3 22h18"/>
    <path d="M14 22a7 7 0 1 0-14 0"/>
    <path d="M9 14h2"/>
    <path d="M9 12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2Z"/>
    <path d="M12 6E-1"/>
  </svg>
{:else if name === 'brush'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/>
    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.04 1.7 1.7 6 2 6.94 1 1.02-1.02.04-5.22-1.94-6.06z"/>
  </svg>
{:else if name === 'gamepad'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="6" x2="10" y1="12" y2="12"/>
    <line x1="8" x2="8" y1="10" y2="14"/>
    <line x1="15" x2="15.01" y1="13" y2="13"/>
    <line x1="18" x2="18.01" y1="11" y2="11"/>
    <rect width="20" height="12" x="2" y="6" rx="6"/>
  </svg>
{:else if name === 'book-open'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
{:else if name === 'credit-card'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/>
    <line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
{:else if name === 'palette'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.72 1.7-1.65 0-.43-.17-.83-.45-1.15-.27-.33-.44-.76-.44-1.2 0-.93.75-1.7 1.7-1.7h2.49c2.76 0 5-2.24 5-5 0-5.52-4.48-10-10-10z"/>
  </svg>
{:else if name === 'sparkles'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
{:else if name === 'crystal' || name === 'oracle'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="10" r="7"/>
    <path d="M5 19h14"/>
    <path d="M8 22h8"/>
    <path d="M12 17v5"/>
  </svg>
{:else if name === 'smile'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <line x1="9" x2="9.01" y1="9" y2="9"/>
    <line x1="15" x2="15.01" y1="9" y2="9"/>
  </svg>
{:else if name === 'tag'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/>
    <path d="M7 7h.01"/>
  </svg>
{:else if name === 'building'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
    <path d="M9 22v-4h6v4"/>
    <path d="M8 6h.01"/>
    <path d="M16 6h.01"/>
    <path d="M12 6h.01"/>
    <path d="M12 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M16 10h.01"/>
    <path d="M16 14h.01"/>
    <path d="M8 10h.01"/>
    <path d="M8 14h.01"/>
  </svg>
{:else if name === 'tent' || name === 'fair'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3.5 21 12 3l8.5 18"/>
    <path d="M12 3v18"/>
    <path d="M7 21a5 5 0 0 1 10 0"/>
  </svg>
{:else if name === 'target'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
{:else if name === 'leaf'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
{:else if name === 'user'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
{:else if name === 'users'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
{:else if name === 'refresh'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
    <path d="M3 21v-5h5"/>
  </svg>
{:else if name === 'scale'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="M7 21h10"/>
    <path d="M12 3v18"/>
    <path d="M3 7h18"/>
  </svg>
{:else if name === 'clock'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
{:else if name === 'map-pin' || name === 'pin'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
{:else if name === 'gear' || name === 'cog'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </svg>
{:else if name === 'chart' || name === 'bar-chart'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" x2="18" y1="20" y2="10"/>
    <line x1="12" x2="12" y1="20" y2="4"/>
    <line x1="6" x2="6" y1="20" y2="14"/>
  </svg>
{:else if name === 'search'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" x2="16.65" y1="21" y2="16.65"/>
  </svg>
{:else if name === 'map'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/>
    <line x1="9" x2="9" y1="3" y2="18"/>
    <line x1="15" x2="15" y1="6" y2="21"/>
  </svg>
{:else if name === 'check'}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
{:else}
  <svg xmlns="http://www.w3.org/2000/svg" class={className} style={customStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
  </svg>
{/if}
