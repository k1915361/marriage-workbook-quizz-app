import process from 'node:process';
import solidPlugin from 'vite-plugin-solid';
import { parseCLI, startVitest } from 'vitest/node';

const { filter, options } = parseCLI(['vitest', ...process.argv.slice(2)], {
  allowUnknownOptions: true,
});

const vitestOptions = {
  ...options,
  root: process.cwd(),
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/test-setup.ts'],
  exclude: ['node_modules', 'dist', 'e2e'],
};

await startVitest('test', filter, vitestOptions, {
  configFile: false,
  root: process.cwd(),
  plugins: [solidPlugin()],
});
