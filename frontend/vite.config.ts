import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Escuchar en todas las interfaces de red (necesario para Docker)
    port: 5173,
    watch: {
      usePolling: true, // Permite el Live Reload / HMR en WSL2 y volúmenes montados
    },
  },
})

