import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
      "/api/v1/": {
        target: "https://ilosiwaju-mbaay-2025.com",
        changeOrigin: true,
        secure: false, // accept self-signed cert if any
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})