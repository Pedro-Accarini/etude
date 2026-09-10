import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Deployed to GitHub Pages at pedro-accarini.github.io/etude/
export default defineConfig({
  base: '/etude/',
  plugins: [react(), tailwindcss()],
})
