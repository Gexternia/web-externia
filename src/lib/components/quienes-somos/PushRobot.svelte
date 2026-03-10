<script lang="ts">
  let { walking = false }: { walking?: boolean } = $props();
</script>

<svg width="62" height="86" viewBox="0 0 62 86" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rp-body" x1="0" y1="0" x2="0" y2="86" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#9B5CF8" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>
    <linearGradient id="rp-dark" x1="0" y1="0" x2="0" y2="86" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6B30C0" />
      <stop offset="100%" stop-color="#1E50B0" />
    </linearGradient>
  </defs>
  <rect x="24" y="0" width="4" height="12" rx="2" fill="url(#rp-dark)" opacity="0.85" />
  <circle cx="26" cy="2.5" r="4.5" fill="white" opacity="0.9" />
  <circle cx="26" cy="2.5" r="2.5" fill="#DDD0FF" />
  <rect x="6" y="10" width="40" height="30" rx="7" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1.5" />
  <rect x="9" y="13" width="18" height="8" rx="3.5" fill="white" opacity="0.18" />
  <circle cx="42" cy="25" r="6" fill="white" opacity="0.9" />
  <circle cx="42" cy="25" r="3.3" fill="#D0B8FF" opacity="0.85" />
  <rect x="21" y="40" width="10" height="5" rx="2.5" fill="url(#rp-dark)" opacity="0.8" />
  <rect x="13" y="45" width="26" height="20" rx="6" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1.5" />
  <rect x="16" y="48" width="12" height="6" rx="3" fill="white" opacity="0.13" />
  <circle cx="29" cy="55" r="3" fill="white" opacity="0.22" />
  <!-- Back arm -->
  <g
    style="transform-origin: 100% 50%; animation: {walking ? 'rp-arm1 0.84s ease-in-out infinite alternate' : 'none'}"
  >
    <rect x="1" y="50" width="13" height="7" rx="3.5" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1.2" />
  </g>
  <!-- Front arm -->
  <g
    style="transform-origin: 0% 50%; animation: {walking ? 'rp-arm2 0.84s ease-in-out 0.16s infinite alternate' : 'none'}"
  >
    <rect x="39" y="50" width="18" height="7" rx="3.5" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1.2" />
  </g>
  <!-- Back leg -->
  <g
    style="transform-origin: 50% 0%; animation: {walking ? 'rp-leg1 0.84s ease-in-out infinite alternate' : 'none'}"
  >
    <rect x="15" y="65" width="10" height="18" rx="4" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1" />
  </g>
  <!-- Front leg -->
  <g
    style="transform-origin: 50% 0%; animation: {walking ? 'rp-leg2 0.84s ease-in-out 0.16s infinite alternate' : 'none'}"
  >
    <rect x="27" y="65" width="10" height="18" rx="4" fill="url(#rp-body)" stroke="url(#rp-dark)" stroke-width="1" />
  </g>
</svg>

<style>
  @keyframes rp-arm1 {
    from { transform: rotate(-10deg); }
    to { transform: rotate(12deg); }
  }
  @keyframes rp-arm2 {
    from { transform: rotate(-18deg); }
    to { transform: rotate(16deg); }
  }
  @keyframes rp-leg1 {
    from { transform: rotate(8deg); }
    to { transform: rotate(-6deg); }
  }
  @keyframes rp-leg2 {
    from { transform: rotate(-8deg); }
    to { transform: rotate(6deg); }
  }
</style>
