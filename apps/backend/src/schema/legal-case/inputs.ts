import { builder } from "@/builder";

export const CreateLegalCaseInput = builder.inputType("CreateLegalCaseInput", {
  fields: (t) => ({
    caseNumber: t.string({ required: true }),
    caseName: t.string({ required: true }),
    summary: t.string({ required: false }),
    parties: t.string({ required: false }),
    plaintiff: t.string({ required: false }),
    defendant: t.string({ required: false }),
    judges: t.string({ required: false }),
    verdict: t.string({ required: false }),
    legalBasis: t.string({ required: false }),
    caseDate: t.field({ type: "DateTime", required: false }),
    resolutionDate: t.field({ type: "DateTime", required: false }),
    jurisdiction: t.string({ required: false }),
    caseType: t.string({ required: false }),
    courtId: t.string({ required: false }),
  }),
});

export const UpdateLegalCaseInput = builder.inputType("UpdateLegalCaseInput", {
  fields: (t) => ({
    caseNumber: t.string({ required: false }),
    caseName: t.string({ required: false }),
    summary: t.string({ required: false }),
    parties: t.string({ required: false }),
    plaintiff: t.string({ required: false }),
    defendant: t.string({ required: false }),
    judges: t.string({ required: false }),
    verdict: t.string({ required: false }),
    legalBasis: t.string({ required: false }),
    caseDate: t.field({ type: "DateTime", required: false }),
    resolutionDate: t.field({ type: "DateTime", required: false }),
    jurisdiction: t.string({ required: false }),
    caseType: t.string({ required: false }),
    courtId: t.string({ required: false }),
  }),
});
