import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import netlifyPlugin from '@netlify/vite-plugin-react-router';

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    netlifyPlugin(),
  ],
  build: {
    commonjsOptions: {
      include: [/@fsoc\/royalroadl-api/, /node_modules/],
      transformMixedEsModules: true
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
});
