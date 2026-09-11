import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  build: {
    target: "esnext",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached independently from app code
          vendor: ["react", "react-dom"],
          // Framer Motion is large (~100 kB); isolate it so app changes don't bust its cache
          motion: ["framer-motion"],
          // Lucide icons tree-shakes well but still benefits from a dedicated chunk
          icons: ["lucide-react"],
        },
      },
    },
  },
});
