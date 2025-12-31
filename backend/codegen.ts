import type { CodegenConfig } from "@graphql-codegen/cli";
import { printSchema } from "graphql";
import { schema } from "./src/schema";

const config: CodegenConfig = {
  schema: printSchema(schema),
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
