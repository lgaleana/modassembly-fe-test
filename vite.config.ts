import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://34.135.155.158:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.removeHeader('Authorization');
            // Preserve query parameters
            const url = new URL(req.url, 'http://localhost');
            proxyReq.path = url.pathname.replace(/^\/api/, '') + url.search;
          });
        }
      }
    }
  },
})

