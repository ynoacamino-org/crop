import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.graphql",
  documents: [
    "../next/src/service/gql/**/*.graphql",
    "../tanstack-frontend/src/service/gql/**/*.graphql",
  ],
  generates: {
    "../next/src/service/gql/generated/gql.client.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-urql"],
      config: { scalars: { DateTime: "Date" } },
    },
    "../next/src/service/gql/generated/gql.node.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: { scalars: { DateTime: "Date" } },
    },
    "../tanstack-frontend/src/service/gql/generated/gql.client.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-urql"],
      config: { scalars: { DateTime: "Date" } },
    },
    "../tanstack-frontend/src/service/gql/generated/gql.node.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: { scalars: { DateTime: "Date" } },
    },
  },
};

export default config;
