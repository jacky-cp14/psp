import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'demo',
  plugins: [react()],
  resolve: {
    alias: {
      '@psp/core': path.resolve(__dirname, 'src/index.ts'),
    },
  },
  server: {
    port: 5173,
  },
});
