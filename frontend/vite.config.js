// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     // Allow access from other devices on the network (like your phone)
//     host: "0.0.0.0", // Listen on all network interfaces
//     port: 5173, // Default Vite port (you can change this if needed)
//     strictPort: false, // If port is in use, try next available port
    
//     proxy: {
//       "/api": {
//         target: "http://localhost:8000",
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ""),
//         // The proxy still works because it forwards from the Vite server
//         // (running on your computer) to localhost:8000 (also on your computer)
//       },
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react()],

    // ✅ Base path (safe for all deployments)
    base: "/",

    // ✅ Dev server only config
    server: isDev
      ? {
          host: "0.0.0.0",
          port: 5173,
          strictPort: false,

          proxy: {
            "/api": {
              target: "http://localhost:8000",
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          },
        }
      : undefined,

    // ✅ Production build config
    build: {
      outDir: "dist",
      sourcemap: false, // set true only if debugging prod
      chunkSizeWarningLimit: 1000,
      emptyOutDir: true,
    },

    // ✅ Preview server (optional, but professional)
    preview: {
      port: 4173,
      strictPort: true,
    },
  };
});