import process from 'node:process';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const hostIndex = args.indexOf('--host');

const port = portIndex >= 0 && args[portIndex + 1] && !args[portIndex + 1].startsWith('--')
  ? Number(args[portIndex + 1])
  : 3000;
const host =
  hostIndex >= 0 && args[hostIndex + 1] && !args[hostIndex + 1].startsWith('--')
    ? args[hostIndex + 1]
    : undefined;

const server = await createServer({
  configFile: false,
  root: process.cwd(),
  plugins: [solidPlugin()],
  resolve: {
    alias: {
      '@marriage-workbook/quiz-data': resolve('./packages/quiz-data/src/index.ts'),
      '@marriage-workbook/quiz-engine': resolve('./packages/quiz-engine/src/index.ts'),
    },
  },
  optimizeDeps: {
    exclude: ['@msviderok/base-ui-solid'],
  },
  server: {
    port,
    host,
  },
});

await server.listen();
server.printUrls();
