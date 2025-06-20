import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/thoughtfulprompts/', // ← this must match your GitHub repo name
  plugins: [react()],
})
