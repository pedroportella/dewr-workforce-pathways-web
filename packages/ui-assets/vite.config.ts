// packages/ui-assets/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@djag-dcir-ui/ui-assets/fonts": path.resolve(__dirname, "fonts"),
      "@djag-dcir-ui/ui-assets/icons": path.resolve(__dirname, "icons"),
      "@djag-dcir-ui/ui-assets/images": path.resolve(__dirname, "images"),
      "@djag-dcir-ui/ui-assets/logos": path.resolve(__dirname, "logos"),
    },
  },
});
