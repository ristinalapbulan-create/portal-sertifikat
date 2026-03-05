import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Tambahkan ini agar aman saat di-deploy ke sub-folder GitHub Pages
})
