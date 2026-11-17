import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,                  // listen on 0.0.0.0 (same lesson as the backend)
    port: 5173,
    watch: { usePolling: true }, // fixes file-change detection on Windows bind mounts
  },
});