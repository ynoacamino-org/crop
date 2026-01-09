import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.graphql",
  documents: ["../frontend/src/gql/**/*.graphql"],
  generates: {
    "../frontend/src/gql/generated/gql.client.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-urql"],
      config: {
        scalars: {
          DateTime: "Date",
        },
      },
    },
    "../frontend/src/gql/generated/gql.node.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: {
        scalars: {
          DateTime: "Date",
        },
      },
    },
  },
};

export default config;
