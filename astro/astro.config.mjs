// @ts-check
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));
const cssFile = fileURLToPath(new URL('./src/styles/global.css', import.meta.url));

/**
 * Agents write new files while the dev server runs, and two things go stale:
 * 1. Tailwind's source scan — utilities used only in a file created after
 *    startup never reach the compiled CSS (page serves 200 but unstyled).
 * 2. Astro's dev watcher doesn't reliably full-reload on content add/unlink.
 * On any add/unlink under src/, bump global.css's mtime so the Tailwind
 * plugin reprocesses (rescanning sources), then trigger a full reload.
 * @returns {import('vite').Plugin}
 */
function freshFileWatcher() {
  return {
    name: 'fresh-file-watcher',
    configureServer(server) {
      server.watcher.add(srcDir);
      const onFile = (/** @type {string} */ file) => {
        if (!file.startsWith(srcDir) || file === cssFile) return;
        const now = new Date();
        fs.utimes(cssFile, now, now, () => {
          setTimeout(() => server.ws.send({ type: 'full-reload' }), 150);
        });
      };
      server.watcher.on('add', onFile);
      server.watcher.on('unlink', onFile);
    },
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],

  vite: {
    plugins: [tailwindcss(), freshFileWatcher()],
  },
});
