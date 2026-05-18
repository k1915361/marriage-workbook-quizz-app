import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig(() => {
  const isGitHubPagesBuild = process.env.GITHUB_PAGES === 'true';

  return {
    base: isGitHubPagesBuild ? '/marriage-workbook-quizz-app/' : '/',
    plugins: [solidPlugin()],
    server: {
      port: 3000,
    },
    build: {
      target: 'esnext',
    },
  };
});
