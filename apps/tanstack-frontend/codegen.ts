import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/schema.graphql",
  documents: ["src/**/*.graphql"],
  generates: {
    "src/service/gql/generated/gql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      config: {
        scalars: { DateTime: "Date" },
        rawRequest: false,
      },
    },
  },
};

export default config;
