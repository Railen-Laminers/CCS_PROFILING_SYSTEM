import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    // Print useful information when server starts
    middlewareMode: false,
  },
  define: {
    // Use localhost for development, or set VITE_API_URL env var for LAN access
    'import.meta.env.VITE_API_URL': JSON.stringify(
      process.env.VITE_API_URL || 'http://localhost:8000/api'
    ),
  },
})
