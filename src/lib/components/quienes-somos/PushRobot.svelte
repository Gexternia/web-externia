<script lang="ts">
  let { walking = false }: { walking?: boolean } = $props();
</script>

<svg width="68" height="88" viewBox="0 0 68 88" fill="none" xmlns="http://www.w3.org/2000/svg" class="overflow-visible">
  <defs>
    <linearGradient id="rp-body" x1="0" y1="0" x2="0" y2="88" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#A86BFF" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>
    <linearGradient id="rp-dark" x1="0" y1="0" x2="0" y2="88" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6B30C0" />
      <stop offset="100%" stop-color="#1E40AF" />
    </linearGradient>
    <filter id="rp-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Leaning container group when pushing/walking -->
  <g class="transition-transform duration-300" style="transform-origin: 30px 75px; transform: {walking ? 'rotate(12deg) translateY(-2px)' : 'rotate(0deg)'}">
    <!-- Antenna -->
    <rect x="24" y="0" width="4" height="12" rx="2" fill="url(#rp-dark)" opacity="0.9" />
    <circle cx="26" cy="2" r="4.5" fill="#38BDF8" filter="url(#rp-glow)" />
    <circle cx="26" cy="2" r="2" fill="#FFFFFF" />

    <!-- Head -->
    <rect x="6" y="10" width="40" height="28" rx="8" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1.5" />
    <rect x="9" y="13" width="18" height="8" rx="4" fill="white" opacity="0.2" />
    <circle cx="38" cy="24" r="6.5" fill="#38BDF8" filter="url(#rp-glow)" />
    <circle cx="38" cy="24" r="3.2" fill="#FFFFFF" />

    <!-- Neck -->
    <rect x="21" y="38" width="10" height="5" rx="2.5" fill="url(#rp-dark)" />

    <!-- Torso -->
    <rect x="13" y="43" width="26" height="22" rx="6" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1.5" />
    <rect x="16" y="46" width="12" height="6" rx="3" fill="white" opacity="0.15" />
    <circle cx="30" cy="54" r="3" fill="#38BDF8" opacity="0.8" />

    <!-- Back arm (pushing posture) -->
    <g style="transform-origin: 16px 48px; animation: {walking ? 'rp-arm-back 0.45s ease-in-out infinite alternate' : 'none'}">
      <rect x="2" y="46" width="18" height="6.5" rx="3.2" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1.2" />
    </g>

    <!-- Front pushing arms (extended forward touching the wall) -->
    <g style="transform-origin: 32px 48px; animation: {walking ? 'rp-arm-front 0.45s ease-in-out infinite alternate' : 'none'}">
      <rect x="28" y="44" width="34" height="7.5" rx="3.75" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1.2" />
      <!-- Pushing hand/pad -->
      <rect x="58" y="41" width="5" height="13.5" rx="2" fill="#38BDF8" filter="url(#rp-glow)" />
    </g>

    <!-- Legs -->
    <g style="transform-origin: 18px 65px; animation: {walking ? 'rp-leg-back 0.45s ease-in-out infinite alternate' : 'none'}">
      <rect x="14" y="65" width="9" height="19" rx="4.5" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1" />
      <rect x="12" y="80" width="13" height="5" rx="2.5" fill="url(#rp-dark)" />
    </g>
    <g style="transform-origin: 28px 65px; animation: {walking ? 'rp-leg-front 0.45s ease-in-out infinite alternate' : 'none'}">
      <rect x="25" y="65" width="9" height="19" rx="4.5" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1" />
      <rect x="23" y="80" width="13" height="5" rx="2.5" fill="url(#rp-dark)" />
    </g>
  </g>
</svg>

<style>
  @keyframes rp-arm-back {
    from { transform: rotate(-15deg) translateX(0); }
    to { transform: rotate(10deg) translateX(2px); }
  }
  @keyframes rp-arm-front {
    from { transform: rotate(4deg) scaleX(0.96); }
    to { transform: rotate(-4deg) scaleX(1.04); }
  }
  @keyframes rp-leg-back {
    from { transform: rotate(22deg); }
    to { transform: rotate(-18deg); }
  }
  @keyframes rp-leg-front {
    from { transform: rotate(-22deg); }
    to { transform: rotate(18deg); }
  }
</style>
