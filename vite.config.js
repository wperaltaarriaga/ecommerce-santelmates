import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// URL pública del sitio, para las etiquetas Open Graph de index.html (necesitan URL absoluta).
// En Vercel se toma sola de VERCEL_PROJECT_PRODUCTION_URL; se puede forzar con VITE_SITE_URL.
const siteUrl =
  process.env.VITE_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')

const reemplazarSiteUrl = {
  name: 'reemplazar-site-url',
  transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), reemplazarSiteUrl],
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
