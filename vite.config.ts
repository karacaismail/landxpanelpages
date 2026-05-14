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
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Önce daha spesifik kuralları çalıştır
            if (id.includes('@phosphor-icons')) return 'icons';
            if (id.includes('flowbite-react') || id.includes('flowbite/')) return 'flowbite';
            if (id.includes('recharts') || id.includes('victory-vendor') || id.includes('d3-')) return 'charts';
            if (id.includes('leaflet')) return 'map';
            if (id.includes('@faker-js')) return 'seed-gen';
            if (id.includes('@tanstack')) return 'query';
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('/zod/')) return 'forms';
            if (id.includes('/i18next') || id.includes('react-i18next')) return 'i18n';
            if (id.includes('/date-fns')) return 'datefns';
            if (id.includes('/zustand') || id.includes('/clsx') || id.includes('/nanoid')) return 'state';
            if (id.includes('/react-dom') || id.includes('/react-router') || id.match(/\/react\/[^/]*$/)) return 'react';
          }
          if (id.includes('src/data/fixtures/modules-detail.ts')) return 'modules-detail';
          if (id.includes('src/data/generators') || id.includes('src/data/seed.ts')) return 'seed-data';
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
