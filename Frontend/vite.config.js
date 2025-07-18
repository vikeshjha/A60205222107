import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {    // ← Allows access from your local network (LAN)
    port: 3000,         // ← Change the port number as you like
  },
})
