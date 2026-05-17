import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    // Use jsdom so DOM APIs (Blob, URL, etc.) exist in tests
    environment: 'jsdom',
    // Make describe/it/expect available without imports in test files
    globals: true,
    // Ensure .tsx/.jsx are transformed through the SolidJS Babel preset
    transformMode: { web: [/\.[jt]sx?$/] },
    // @testing-library/jest-dom matchers (toBeInTheDocument etc.)
    setupFiles: ['./src/test-setup.ts'],
  },
});
