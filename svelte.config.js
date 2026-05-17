import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      origin: 'https://externia.ai',
      handleHttpError: ({ path, referrer, message }) => {
        if (path.includes('/favicon')) return;
        throw new Error(message);
      },
      handleMissingId: 'ignore',
      // Rutas dinámicas no listadas en `entries()` se ignoran (p. ej. /blog/abc).
      handleUnseenRoutes: 'ignore'
    }
  }
};

export default config;
