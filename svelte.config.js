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
      handleMissingId: 'ignore'
    }
  }
};

export default config;
