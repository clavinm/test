import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Vite PWA Project',
        short_name: 'Vite PWA Project',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        description:
          'Pwa Setup Project Where you can send notifications and also click pictures record vedio and install the application in the mobile devices',
        screenshots: [
          {
            src: 's4.png',
            type: 'image/png',
            sizes: '720x540',
            form_factor: 'wide',
          },
          {
            src: 's4a.png',
            type: 'image/png',
            sizes: '720x540',
            form_factor: 'wide',
          },
          {
            src: 's1a.png',
            type: 'image/png',
            sizes: '540x720',
            form_factor: 'narrow',
          },
          {
            src: 's2a.png',
            type: 'image/png',
            sizes: '540x720',
            form_factor: 'narrow',
          },
          {
            src: 's3a.png',
            type: 'image/png',
            sizes: '540x720',
            form_factor: 'narrow',
          },
        ],
      },
    }),
  ],
});
