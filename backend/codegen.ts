import type { CodegenConfig } from "@graphql-codegen/cli";
import { printSchema } from "graphql";
import { schema } from "./src/schema";

const config: CodegenConfig = {
  schema: printSchema(schema),
  documents: ["../frontend/src/gql/**/*.graphql"],
  generates: {
    "../frontend/src/gql/": {
      plugins: ["typescript", "typescript-operations", "typescript-urql"],
    },
  },
};

export default config;
