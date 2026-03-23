import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@psp/core': path.resolve(__dirname, '../packages/psp-list-core/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.join(__dirname, 'vitest.setup.ts')],
    include: ['__tests__/**/*.test.{ts,tsx}'],
  },
});
