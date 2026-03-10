<script lang="ts">
  let { pulling = false }: { pulling?: boolean } = $props();
</script>

<svg width="80" height="96" viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rpu-body" x1="0" y1="0" x2="0" y2="96" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#9B5CF8" />
      <stop offset="100%" stop-color="#3B82F6" />
    </linearGradient>
    <linearGradient id="rpu-dark" x1="0" y1="0" x2="0" y2="96" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6B30C0" />
      <stop offset="100%" stop-color="#1E50B0" />
    </linearGradient>
  </defs>
  <rect x="37" y="0" width="6" height="12" rx="2" fill="url(#rpu-dark)" opacity="0.85" />
  <circle cx="40" cy="2.5" r="5" fill="white" opacity="0.9" />
  <circle cx="40" cy="2.5" r="2.8" fill="#DDD0FF" />
  <rect x="13" y="10" width="54" height="38" rx="8" fill="url(#rpu-body)" stroke="url(#rpu-dark)" stroke-width="1.5" />
  <rect x="17" y="13" width="24" height="9" rx="3.5" fill="white" opacity="0.16" />
  <circle cx="28" cy="32" r="7" fill="white" opacity="0.9" />
  <circle cx="28" cy="32" r="4" fill="#D0B8FF" opacity="0.85" />
  <circle cx="52" cy="32" r="7" fill="white" opacity="0.9" />
  <circle cx="52" cy="32" r="4" fill="#D0B8FF" opacity="0.85" />
  <rect x="36" y="48" width="8" height="6" rx="3" fill="url(#rpu-dark)" opacity="0.8" />
  <rect x="21" y="54" width="38" height="26" rx="7" fill="url(#rpu-body)" stroke="url(#rpu-dark)" stroke-width="1.5" />
  <rect x="25" y="57" width="17" height="7" rx="3" fill="white" opacity="0.13" />
  <circle cx="32" cy="71" r="3.5" fill="white" opacity="0.22" />
  <circle cx="48" cy="71" r="3.5" fill="white" opacity="0.22" />
  <rect x="27" y="79" width="11" height="17" rx="4" fill="url(#rpu-body)" stroke="url(#rpu-dark)" stroke-width="1" />
  <rect x="42" y="79" width="11" height="17" rx="4" fill="url(#rpu-body)" stroke="url(#rpu-dark)" stroke-width="1" />
</svg>
