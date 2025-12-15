import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Allow access from other devices on the network (like your phone)
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173, // Default Vite port (you can change this if needed)
    strictPort: false, // If port is in use, try next available port
    
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        // The proxy still works because it forwards from the Vite server
        // (running on your computer) to localhost:8000 (also on your computer)
      },
    },
  },
});


