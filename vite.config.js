import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // El único archivo grande es el SDK de Firebase (auth + firestore, ~550 kB sin comprimir,
    // ~160 kB gzip). Se necesita desde el arranque para la sesión, así que no se puede diferir.
    chunkSizeWarningLimit: 600
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: { modules: { classNameStrategy: 'non-scoped' } }
  }
})
