import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Allows external access (needed for Docker)
    watch: {
      usePolling: true, // Enables file watching inside Docker
    },
  },
});
