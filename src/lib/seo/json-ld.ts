/** @id compartido con el nodo Organization del mismo documento */
export const ORGANIZATION_ID = 'https://externia.ai/#organization';
export const WEBSITE_ID = 'https://externia.ai/#website';

const SEGMENT_LABELS: Record<string, string> = {
  'quienes-somos': 'Quiénes somos',
  servicios: 'Activaciones',
  consultoria: 'Consultoría',
  formacion: 'Formación',
  blog: 'Blog',
  'travel-manager': 'Travel Manager',
  contacto: 'Contáctanos',
  'aviso-legal': 'Aviso legal',
  'politica-cookies': 'Política de cookies',
  'politica-privacidad': 'Política de privacidad'
};

/** Evita romper </script> si el texto del API u otros campos contienen `<`. */
export function toJsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function buildOrganizationSchema(origin: string) {
  const base = origin.replace(/\/$/, '');
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Externia',
    legalName: 'Externia Event Solutions S.L.',
    url: base,
    logo: `${base}/externia-icon.svg`,
    email: 'g.prado@externia.ai',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'C/ San Pedro De Cardeña 8, 9 derecha',
      addressLocality: 'Madrid',
      postalCode: '28033',
      addressCountry: 'ES'
    },
    sameAs: [
      'https://www.instagram.com/externia.ai/',
      'https://www.youtube.com/watch?v=fyhhzgNvunw&t=1s'
    ]
  };
}

export function buildWebSiteSchema(origin: string, description: string) {
  const base = origin.replace(/\/$/, '');
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: base,
    name: 'Externia',
    description,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'es-ES'
  };
}

export function buildGraphOrganizationWebSite(origin: string, siteDescription: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildOrganizationSchema(origin), buildWebSiteSchema(origin, siteDescription)]
  };
}

export type BreadcrumbItem = { name: string; item: string };

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item
    }))
  };
}

/** Mínimo 2 ítems (Inicio + sección); en portada no se emite. */
export function maybeBreadcrumbSchema(
  origin: string,
  pathname: string
): ReturnType<typeof buildBreadcrumbSchema> | null {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  if (normalized === '' || normalized === '/') return null;
  const items = breadcrumbsFromPathname(origin, pathname);
  if (items.length < 2) return null;
  return buildBreadcrumbSchema(items);
}

/** Migas de pan para rutas de una sola sección (no artículos de blog). */
export function breadcrumbsFromPathname(origin: string, pathname: string): BreadcrumbItem[] {
  const base = origin.replace(/\/$/, '');
  const normalized =
    pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const items: BreadcrumbItem[] = [{ name: 'Inicio', item: `${base}/` }];
  if (normalized === '' || normalized === '/') {
    return items;
  }
  const segments = normalized.split('/').filter(Boolean);
  let acc = '';
  for (const seg of segments) {
    acc += `/${seg}`;
    const label = SEGMENT_LABELS[seg] ?? seg.replace(/-/g, ' ');
    items.push({ name: label, item: `${base}${acc}` });
  }
  return items;
}

export function buildArticleBreadcrumbItems(
  origin: string,
  articlePath: string,
  articleTitle: string
): BreadcrumbItem[] {
  const base = origin.replace(/\/$/, '');
  return [
    { name: 'Inicio', item: `${base}/` },
    { name: 'Blog', item: `${base}/blog` },
    { name: articleTitle, item: `${base}${articlePath}` }
  ];
}

export function buildTravelManagerArticleBreadcrumbItems(
  origin: string,
  articlePath: string,
  articleTitle: string
): BreadcrumbItem[] {
  const base = origin.replace(/\/$/, '');
  return [
    { name: 'Inicio', item: `${base}/` },
    { name: 'Blog', item: `${base}/blog` },
    { name: 'Travel Manager', item: `${base}/blog/travel-manager` },
    { name: articleTitle, item: `${base}${articlePath}` }
  ];
}

export function buildArticleSchema(opts: {
  origin: string;
  pathname: string;
  headline: string;
  description: string;
  imageUrl: string;
}) {
  const base = opts.origin.replace(/\/$/, '');
  const path = opts.pathname === '/' ? '' : opts.pathname;
  const pageUrl = `${base}${path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: pageUrl,
    image: opts.imageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl
    },
    author: { '@id': ORGANIZATION_ID },
    publisher: {
      '@id': ORGANIZATION_ID
    },
    inLanguage: 'es-ES'
  };
}
