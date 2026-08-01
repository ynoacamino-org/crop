import { builder } from "@/shared/graphql/builder";

export const ApiKey = builder
  .objectRef<{
    id: string;
    name: string | null;
    prefix: string | null;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt?: Date;
  }>("ApiKey")
  .implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      name: t.expose("name", { type: "String", nullable: true }),
      prefix: t.expose("prefix", { type: "String", nullable: true }),
      expiresAt: t.expose("expiresAt", { type: "DateTime", nullable: true }),
      createdAt: t.expose("createdAt", { type: "DateTime" }),
    }),
  });
