import fs from "node:fs";

const filePath = "../frontend/src/gql/generated/gql.client.ts";

let content = fs.readFileSync(filePath, "utf8");

content = `"use client";\n\n${content}`;

fs.writeFileSync(filePath, content);
