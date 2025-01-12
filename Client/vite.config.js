import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@comp": path.resolve(__dirname, "./src/components"),
      "@datas": path.resolve(__dirname, "./src/assets/datas"),
      "@icons": path.resolve(__dirname, "./src/assets/icons"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
    },
  },
});
