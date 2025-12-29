import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production config - API URL from environment variable
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // In production, use environment variable for API URL
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8080'),
  },
});

