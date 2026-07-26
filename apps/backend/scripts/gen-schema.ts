import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { printSchema } from "graphql";
import { schema } from "@/shared/graphql/schema";

const schemaAsString = printSchema(schema);
const outputPath = join(__dirname, "../schema.graphql");

writeFileSync(outputPath, schemaAsString, "utf-8");

// biome-ignore lint/suspicious/noConsole: Script output
console.log(`✅ Schema generado en: ${outputPath}`);
