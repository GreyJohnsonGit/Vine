import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: './dist',
  },
  plugins: [{ name: '@vitejs/plugin-react'}],
  server: {
    port: 3000,
  },
});