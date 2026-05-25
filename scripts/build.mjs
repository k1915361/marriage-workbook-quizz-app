import process from 'node:process';
import { resolve } from 'node:path';
import { build } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true';

await build({
  configFile: false,
  root: process.cwd(),
  base: isGitHubPagesBuild ? '/marriage-workbook-quizz-app/' : '/',
  plugins: [solidPlugin()],
  resolve: {
    alias: {
      '@marriage-workbook/quiz-data': resolve('./packages/quiz-data/src/index.ts'),
      '@marriage-workbook/quiz-engine': resolve('./packages/quiz-engine/src/index.ts'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
