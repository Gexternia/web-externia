/**
 * Parche para @sveltejs/vite-plugin-svelte: evita error styleText en Node < 20.12/21.7.
 * Se ejecuta en postinstall para que el build funcione en Render y en entornos con Node antiguo.
 */
const fs = require('fs');
const path = require('path');

const logPath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@sveltejs',
  'vite-plugin-svelte',
  'src',
  'utils',
  'log.js'
);

// Solo reemplazar la línea del import; el resto del archivo se mantiene
const OLD_LINE = "import { styleText } from 'node:util';";
const NEW_LINES = "import util from 'node:util';\nconst styleText = typeof util.styleText === 'function' ? util.styleText : (/** @type {string} */ _style, /** @type {string} */ txt) => txt;";

if (!fs.existsSync(logPath)) {
  console.warn('[patch-svelte-plugin-log] log.js no encontrado, omitiendo parche.');
  process.exit(0);
}

let content = fs.readFileSync(logPath, 'utf8');
if (content.includes(OLD_LINE)) {
  content = content.replace(OLD_LINE, NEW_LINES);
  // Quitar el comentario eslint que ya no aplica
  content = content.replace(
    '// eslint-disable-next-line n/no-unsupported-features/node-builtins\n',
    '// Fallback for Node < 20.12/21.7 (styleText)\n'
  );
  fs.writeFileSync(logPath, content);
  console.log('[patch-svelte-plugin-log] Parche aplicado para Node sin styleText.');
} else if (content.includes("import util from 'node:util'")) {
  console.log('[patch-svelte-plugin-log] Ya parcheado.');
} else {
  console.log('[patch-svelte-plugin-log] Versión del plugin distinta, omitiendo.');
}
