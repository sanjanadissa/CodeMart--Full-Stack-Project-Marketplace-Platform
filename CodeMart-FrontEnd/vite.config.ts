import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const isDocker = process.env.DOCKER_ENV
const apiTarget = isDocker ? 'http://api:8080' : 'https://localhost:7198';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    hmr: {
      host: 'localhost',
      port: 5173,
    },
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
