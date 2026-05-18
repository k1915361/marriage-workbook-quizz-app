import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  test: {
    // Use jsdom so DOM APIs (Blob, URL, etc.) exist in tests
    environment: 'jsdom',
    // Make describe/it/expect available without imports in test files
    globals: true,
    // @testing-library/jest-dom matchers (toBeInTheDocument etc.)
    setupFiles: ['./src/test-setup.ts'],
    // Exclude e2e tests from Vitest (they're run by Playwright)
    exclude: ['node_modules', 'dist', 'e2e'],
  },
});
