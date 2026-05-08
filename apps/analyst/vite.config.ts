import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  envPrefix: ["VITE_", "NEXT_PUBLIC_"],
  test: {
    environment: "jsdom",
    exclude: ["src/tests/e2e/**", "node_modules/**"],
  },
});
