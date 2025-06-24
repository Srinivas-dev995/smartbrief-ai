import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/auth/user/": {
        target: "https://smartbrief-ai.onrender.com",
        changeOrigin: true,
        secure: false,
      },
      "/api/admin/": {
        target: "https://smartbrief-ai.onrender.com",
        changeOrigin: true,
        secure: false,
      },

      "/api/summary/": {
        target: "https://smartbrief-ai.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
