import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/schema.graphql",
  documents: ["src/**/*.graphql"],
  generates: {
    "src/service/gql/generated/gql.client.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-urql"],
      config: { scalars: { DateTime: "Date" } },
    },
    "src/service/gql/generated/gql.node.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: { scalars: { DateTime: "Date" } },
    },
  },
};

export default config;
