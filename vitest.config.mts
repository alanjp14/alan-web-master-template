import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      // Mirrors tsconfig.json's `"@/*": ["./*"]` so tests use the same
      // import paths as the app.
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
