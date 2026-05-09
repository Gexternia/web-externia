/**
 * Sitúa <title> y <meta name="description"> justo tras <meta charset>,
 * antes de modulepreload y demás. Así los crawlers ven el título y la
 * descripción en las primeras líneas del HTML (mejor que al final del head).
 */
export function promoteSeoTagsInHead(html: string): string {
  if (!html.includes('</title>')) return html;

  const titleRe = /<title\b[^>]*>[\s\S]*?<\/title>/gi;
  const titleMatches = [...html.matchAll(titleRe)];
  if (titleMatches.length === 0) return html;
  const titleTag = titleMatches[titleMatches.length - 1]![0];

  const descRe = /<meta\s+[^>]*\bname\s*=\s*["']description["'][^>]*>/gi;
  const descMatches = [...html.matchAll(descRe)];
  const descTag = descMatches.length > 0 ? descMatches[descMatches.length - 1]![0] : '';

  let rest = html.replace(titleRe, '');
  if (descTag) rest = rest.replace(descRe, '');

  const block = `\n\t\t${titleTag}${descTag ? `\n\t\t${descTag}` : ''}`;
  const charsetRe = /<meta\s+charset\s*=\s*["']utf-8["']\s*\/?>/i;
  const m = rest.match(charsetRe);
  if (m?.index !== undefined) {
    const end = m.index + m[0].length;
    return rest.slice(0, end) + block + rest.slice(end);
  }

  const headOpen = rest.indexOf('<head>');
  if (headOpen === -1) return html;
  const insertAt = rest.indexOf('>', headOpen) + 1;
  return rest.slice(0, insertAt) + block + rest.slice(insertAt);
}
