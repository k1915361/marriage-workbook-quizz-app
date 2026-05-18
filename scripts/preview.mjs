import process from 'node:process';
import { preview } from 'vite';

const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const hostIndex = args.indexOf('--host');

const port = portIndex >= 0 && args[portIndex + 1] && !args[portIndex + 1].startsWith('--')
  ? Number(args[portIndex + 1])
  : 4173;
const host =
  hostIndex >= 0 && args[hostIndex + 1] && !args[hostIndex + 1].startsWith('--')
    ? args[hostIndex + 1]
    : undefined;

const server = await preview({
  configFile: false,
  root: process.cwd(),
  preview: {
    port,
    host,
  },
});

server.printUrls();
