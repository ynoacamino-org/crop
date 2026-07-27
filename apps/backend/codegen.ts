import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./schema.graphql",
  documents: ["src/__tests__/graphql/documents/**/*.graphql"],
  generates: {
    "src/__tests__/graphql/generated/test-gql.ts": {
      plugins: ["typescript-operations", "typed-document-node"],
      config: {
        scalars: { DateTime: "Date" },
        enumType: "native",
        avoidOptionals: false,
      },
    },
  },
};

export default config;
