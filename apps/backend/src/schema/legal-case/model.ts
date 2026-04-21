import { builder } from "@/builder";
import { Jurisdiction } from "../court/model";

export const LegalCase = builder.drizzleObject("legalCases", {
  name: "LegalCase",
  fields: (t) => ({
    id: t.exposeID("id"),
    caseNumber: t.exposeString("caseNumber"),
    caseName: t.exposeString("caseName"),
    slug: t.exposeString("slug"),
    summary: t.exposeString("summary", { nullable: true }),
    parties: t.exposeString("parties", { nullable: true }),
    plaintiff: t.exposeString("plaintiff", { nullable: true }),
    defendant: t.exposeString("defendant", { nullable: true }),
    judges: t.exposeString("judges", { nullable: true }),
    verdict: t.exposeString("verdict", { nullable: true }),
    legalBasis: t.exposeString("legalBasis", { nullable: true }),
    caseDate: t.expose("caseDate", { type: "DateTime", nullable: true }),
    resolutionDate: t.expose("resolutionDate", {
      type: "DateTime",
      nullable: true,
    }),
    jurisdiction: t.expose("jurisdiction", {
      type: Jurisdiction,
      nullable: true,
    }),
    caseType: t.relation("caseType"),
    court: t.relation("court"),
    articles: t.relation("articles"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});
