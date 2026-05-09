export type SeoEntry = { title: string; description: string };

/** Metadatos por ruta (pathname sin query). Fuente única para <title>, description y redes sociales en el layout. */
const ROUTES: Record<string, SeoEntry> = {
  '/': {
    title: 'Externia — Consultoría de IA para eventos | AI for Events',
    description:
      'Primera consultora de inteligencia artificial especializada en el sector MICE y eventos. Activaciones con IA, formación y consultoría estratégica.'
  },
  '/quienes-somos': {
    title: 'Quiénes Somos — Externia AI for Events',
    description:
      'Externia es la primera consultora de inteligencia artificial especializada al 100% en el sector MICE.'
  },
  '/servicios': {
    title: 'Activaciones — Externia AI for Events',
    description: 'Activaciones de IA para eventos. Experiencias interactivas, consultoría y formación.'
  },
  '/consultoria': {
    title: 'Consultoría — Externia AI for Events',
    description:
      'Consultoría estratégica de IA para eventos. Integración real, no genérica, diseñada para el sector MICE.'
  },
  '/formacion': {
    title: 'Formación — Externia AI for Events',
    description: 'Formaciones en IA para eventos. Programas y talleres.'
  },
  '/blog': {
    title: 'Blog de Inteligencia Artificial — Externia AI for Events',
    description: 'Novedades de IA para el sector eventos. Resumen semanal.'
  },
  '/contacto': {
    title: 'Contáctanos — Externia AI for Events',
    description: 'Contacta con Externia. Cuéntanos tu proyecto o evento.'
  },
  '/aviso-legal': {
    title: 'Aviso legal — Externia',
    description:
      'Información legal y datos identificativos de Externia Event Solutions S.L. conforme a la LSSI-CE (externia.ai).'
  },
  '/politica-cookies': {
    title: 'Política de Cookies — Externia',
    description:
      'Información sobre el uso de cookies en el sitio web de Externia (externia.ai) y cómo gestionarlas.'
  },
  '/politica-privacidad': {
    title: 'Política de privacidad — Externia',
    description:
      'Política de privacidad y tratamiento de datos personales de Externia Event Solutions S.L.'
  }
};

export function getSeo(pathname: string): SeoEntry {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  return ROUTES[normalized] ?? ROUTES['/'];
}

/** Rutas /blog/123: metadatos sociales los define la página (contenido dinámico). */
export function isBlogArticlePath(pathname: string): boolean {
  return /^\/blog\/\d+$/.test(pathname);
}
