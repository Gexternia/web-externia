<script lang="ts">
  let { pulling = false }: { pulling?: boolean } = $props();
</script>

<svg width="84" height="98" viewBox="0 0 84 98" fill="none" xmlns="http://www.w3.org/2000/svg" class="overflow-visible">
  <defs>
    <linearGradient id="rpu-body" x1="0" y1="0" x2="0" y2="98" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#A86BFF" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>
    <linearGradient id="rpu-dark" x1="0" y1="0" x2="0" y2="98" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6B30C0" />
      <stop offset="100%" stop-color="#1E40AF" />
    </linearGradient>
    <filter id="rpu-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <g class="transition-transform duration-300" style="transform-origin: 42px 85px; transform: {pulling ? 'rotate(-6deg) translateY(4px)' : 'rotate(0deg)'}">
    <!-- Antenna -->
    <rect x="39" y="0" width="6" height="12" rx="2" fill="url(#rpu-dark)" opacity="0.85" />
    <circle cx="42" cy="2.5" r="5" fill="#38BDF8" filter="url(#rpu-glow)" />
    <circle cx="42" cy="2.5" r="2.5" fill="#FFFFFF" />

    <!-- Head -->
    <rect x="15" y="10" width="54" height="38" rx="10" fill="url(#rpu-body)" stroke="url(#rpu-dark)" stroke-width="1.5" />
    <rect x="19" y="13" width="24" height="9" rx="4.5" fill="white" opacity="0.18" />

    <!-- Eyes -->
    <circle cx="30" cy="32" r="7" fill="#38BDF8" filter="url(#rpu-glow)" />
    <circle cx="30" cy="32" r="3.5" fill="#FFFFFF" />
    <circle cx="54" cy="32" r="7" fill="#38BDF8" filter="url(#rpu-glow)" />
    <circle cx="54" cy="32" r="3.5" fill="#FFFFFF" />

    <!-- Neck -->
    <rect x="38" y="48" width="8" height="6" rx="3" fill="url(#rpu-dark)" opacity="0.9" />

    <!-- Torso -->
    <rect x="23" y="54" width="38" height="26" rx="8" fill="url(#rpu-body)" stroke="url(#rpu-dark)" stroke-width="1.5" />
    <rect x="27" y="57" width="17" height="7" rx="3.5" fill="white" opacity="0.15" />
    <circle cx="34" cy="71" r="3.5" fill="#38BDF8" opacity="0.8" />
    <circle cx="50" cy="71" r="3.5" fill="#38BDF8" opacity="0.8" />

    <!-- Legs (Flexed when pulling) -->
    <g class="transition-all duration-300" style="transform: {pulling ? 'scaleY(0.88)' : 'scaleY(1)'}">
      <rect x="27" y="79" width="11" height="18" rx="4.5" fill="url(#rpu-body)" stroke="url(#rpu-dark)" stroke-width="1" />
      <rect x="46" y="79" width="11" height="18" rx="4.5" fill="url(#rpu-body)" stroke="url(#rpu-dark)" stroke-width="1" />
      <rect x="24" y="93" width="15" height="5" rx="2.5" fill="url(#rpu-dark)" />
      <rect x="45" y="93" width="15" height="5" rx="2.5" fill="url(#rpu-dark)" />
    </g>
  </g>
</svg>
