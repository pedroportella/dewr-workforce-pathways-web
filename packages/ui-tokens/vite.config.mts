import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";

const findScssFiles = (directory: string): string[] =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return findScssFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith(".scss") ? [entryPath] : [];
  });

const entries = Object.fromEntries(
  findScssFiles(path.resolve(import.meta.dirname, "src/scss")).map((file) => {
    const name = path.basename(file, ".scss");
    return [name, file];
  }),
);

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
  build: {
    rollupOptions: {
      input: entries,
      output: {
        assetFileNames: "[name].css",
        entryFileNames: "[name].js", // unused, but Vite requires it
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "src/scss/styles/qld-default.scss" as *;`,
      },
    },
  },
});
