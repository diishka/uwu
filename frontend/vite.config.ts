import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const target = process.env.VITE_PROXY ?? 'http://localhost:8000'
export default defineConfig({ plugins: [react()], server: { port: 5173, proxy: { '/api': { target, ws: true, changeOrigin: true } } } })
