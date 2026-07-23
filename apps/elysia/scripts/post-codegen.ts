import { readFileSync, writeFileSync } from "node:fs";

const filePath = "../tanstack-frontend/src/service/gql/generated/gql.node.ts";
let content = readFileSync(filePath, "utf-8");
content = content.replace(
  /import \{ TypedDocumentNode as DocumentNode \} from/,
  "import type { TypedDocumentNode as DocumentNode } from",
);
writeFileSync(filePath, content, "utf-8");
