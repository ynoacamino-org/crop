import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/schema.graphql",
  documents: ["src/**/*.graphql"],
  generates: {
    "src/service/gql/generated/gql.client.ts": {
      plugins: ["typescript-operations", "typescript-urql"],
      config: { scalars: { DateTime: "Date" }, enumType: "native" },
    },
    "src/service/gql/generated/gql.node.ts": {
      plugins: ["typescript-operations", "typed-document-node"],
      config: { scalars: { DateTime: "Date" }, enumType: "native" },
    },
  },
};

export default config;
