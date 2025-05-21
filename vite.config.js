import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: './', // Important for Cloudflare Pages
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url))
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: true,
    },
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@assets': resolve(__dirname, './assets'),
    },
  },
  plugins: [],
  optimizeDeps: {
    include: ['lit', '@lit/reactive-element', '@lit-labs/ssr-client'],
  },
});