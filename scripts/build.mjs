import process from 'node:process';
import { build } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true';

await build({
  configFile: false,
  root: process.cwd(),
  base: isGitHubPagesBuild ? '/marriage-workbook-quizz-app/' : '/',
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
