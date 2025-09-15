import { defineConfig } from 'vite';

export default defineConfig({
  base: '/re-jblob/', 
  build: {
    outDir: 'docs',
    assetsDir: 'assets',
    emptyOutDir: true, 
    sourcemap: false, 
  }
});