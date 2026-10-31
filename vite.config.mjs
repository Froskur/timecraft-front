import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const backendUrl = process.env.BACKEND_URL || 'https://back.timecraft.meditum.eu';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  preview: {
    host: '0.0.0.0',
    port: 3100,
    proxy: {
      '/v1': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
      '/openapi.yaml': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/v1': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
      '/openapi.yaml': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
});
