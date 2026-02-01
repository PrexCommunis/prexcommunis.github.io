import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // Base path for GitHub Pages (repo name) OR '/' for user site.
  // We use './' to make it relative and compatible with both.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'robots.txt'], // Add other assets if valid
      manifest: {
        name: 'Common Prayer - Daily Office',
        short_name: 'Common Prayer',
        description: 'Daily Office prayers from the Book of Common Prayer',
        theme_color: '#8b6914',
        background_color: '#f4f1e8',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon.svg', // Will be resolved correctly by Vite
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
