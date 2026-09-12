import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Ajout du plugin Tailwind ici
  ],
  test: {
    environment: 'jsdom', // Simule un navigateur pour tester React
    globals: true,
  }
})