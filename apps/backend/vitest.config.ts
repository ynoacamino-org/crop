import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@graphql-typed-document-node/core": path.resolve(
        __dirname,
        "./src/__tests__/graphql/shims/@graphql-typed-document-node-core.ts",
      ),
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
