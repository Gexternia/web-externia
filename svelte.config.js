import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({ pages: 'dist', assets: 'dist', strict: false }),
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        if (path.includes('/favicon')) return;
        throw new Error(message);
      },
      handleMissingId: 'ignore',
      // /blog/[id] no se pre-renderiza (datos en cliente); evita fallo de build al no tener entries
      handleUnseenRoutes: 'ignore'
    }
  }
};

export default config;
