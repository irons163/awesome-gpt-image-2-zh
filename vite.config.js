import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { localApi } from './scripts/vite-local-api.mjs';

export default defineConfig({
  plugins: [localApi(), react()],
  publicDir: 'data',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
