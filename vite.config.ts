import { defineConfig } from 'vite'
import { TanStackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouter(), 
    react()
  ],
})
