import { builder } from "@/infrastructure/graphql/builder";

export const CaseType = builder.drizzleObject("caseTypes", {
  name: "CaseType",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    slug: t.exposeString("slug"),
    description: t.exposeString("description", { nullable: true }),
    color: t.exposeString("color", { nullable: true }),
    icon: t.exposeString("icon", { nullable: true }),
    order: t.exposeInt("order", { nullable: true }),
    active: t.exposeBoolean("active"),
    legalCases: t.relation("legalCases"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});
