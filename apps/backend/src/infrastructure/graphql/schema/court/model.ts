import { builder } from "@/infrastructure/graphql/builder";

export const CourtType = builder.enumType("CourtType", {
  values: [
    "SUPREMA",
    "SUPERIOR",
    "PRIMERA_INSTANCIA",
    "ESPECIALIZADA",
    "CONSTITUCIONAL",
  ] as const,
});

export const Jurisdiction = builder.enumType("Jurisdiction", {
  values: ["NACIONAL", "REGIONAL", "LOCAL", "INTERNACIONAL"] as const,
});

export const Court = builder.drizzleObject("courts", {
  name: "Court",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    type: t.expose("type", { type: CourtType, nullable: true }),
    jurisdiction: t.expose("jurisdiction", {
      type: Jurisdiction,
      nullable: true,
    }),
    description: t.exposeString("description", { nullable: true }),
    cases: t.relation("cases"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});
