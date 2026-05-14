/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  base: '/landxpanelpages/',
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query', '@tanstack/react-table'],
          ui: ['flowbite-react', 'flowbite', '@phosphor-icons/react'],
          map: ['leaflet', 'react-leaflet'],
          charts: ['recharts'],
          forms: ['react-hook-form', 'zod', '@hookform/resolvers']
        }
      }
    }
  },
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts']
  }
});
