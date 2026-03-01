import { builder } from "@/builder";
import { Jurisdiction } from "../court/model";

export const CaseType = builder.enumType("CaseType", {
  values: [
    "CIVIL",
    "PENAL",
    "CONSTITUCIONAL",
    "LABORAL",
    "ADMINISTRATIVO",
    "COMERCIAL",
    "FAMILIA",
    "TRIBUTARIO",
    "AMBIENTAL",
  ] as const,
});

export const LegalCase = builder.prismaObject("LegalCase", {
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
    caseType: t.expose("caseType", { type: CaseType, nullable: true }),
    court: t.relation("court", {
      nullable: true,
    }),
    articles: t.relation("articles", {
      nullable: false,
    }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
  }),
});
