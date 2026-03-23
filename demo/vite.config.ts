import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@psp/core': path.resolve(__dirname, '../packages/psp-list-core/src/index.ts'),
    },
  },
  server: {
    port: 5173,
  },
});
