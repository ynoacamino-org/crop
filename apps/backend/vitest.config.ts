import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["graphql", "@graphql-typed-document-node/core"],
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    server: {
      deps: {
        inline: [/.*/],
      },
    },
  },
});
