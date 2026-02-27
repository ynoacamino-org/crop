import {
  CaseTypeEnum,
  createLegalCaseSchema,
  JurisdictionEnum,
  updateLegalCaseSchema,
} from "@repo/schemas";
import { builder } from "@/builder";

export const CreateLegalCaseInput = builder.inputType("CreateLegalCaseInput", {
  fields: (t) => ({
    caseNumber: t.string({
      required: true,
      validate: createLegalCaseSchema.shape.caseNumber,
    }),
    caseName: t.string({
      required: true,
      validate: createLegalCaseSchema.shape.caseName,
    }),
    summary: t.string({
      required: false,
      validate: createLegalCaseSchema.shape.summary,
    }),
    parties: t.string({
      required: false,
      validate: createLegalCaseSchema.shape.parties,
    }),
    plaintiff: t.string({
      required: false,
      validate: createLegalCaseSchema.shape.plaintiff,
    }),
    defendant: t.string({
      required: false,
      validate: createLegalCaseSchema.shape.defendant,
    }),
    judges: t.string({
      required: false,
      validate: createLegalCaseSchema.shape.judges,
    }),
    verdict: t.string({
      required: false,
      validate: createLegalCaseSchema.shape.verdict,
    }),
    legalBasis: t.string({
      required: false,
      validate: createLegalCaseSchema.shape.legalBasis,
    }),
    caseDate: t.field({
      type: "DateTime",
      required: false,
    }),
    resolutionDate: t.field({
      type: "DateTime",
      required: false,
    }),
    jurisdiction: t.string({
      required: false,
      validate: JurisdictionEnum.optional(),
    }),
    caseType: t.string({
      required: false,
      validate: CaseTypeEnum.optional(),
    }),
    courtId: t.string({
      required: false,
      validate: createLegalCaseSchema.shape.courtId,
    }),
  }),
});

export const UpdateLegalCaseInput = builder.inputType("UpdateLegalCaseInput", {
  fields: (t) => ({
    caseNumber: t.string({
      required: false,
      validate: updateLegalCaseSchema.shape.caseNumber,
    }),
    caseName: t.string({
      required: false,
      validate: updateLegalCaseSchema.shape.caseName,
    }),
    summary: t.string({
      required: false,
      validate: updateLegalCaseSchema.shape.summary,
    }),
    parties: t.string({
      required: false,
      validate: updateLegalCaseSchema.shape.parties,
    }),
    plaintiff: t.string({
      required: false,
      validate: updateLegalCaseSchema.shape.plaintiff,
    }),
    defendant: t.string({
      required: false,
      validate: updateLegalCaseSchema.shape.defendant,
    }),
    judges: t.string({
      required: false,
      validate: updateLegalCaseSchema.shape.judges,
    }),
    verdict: t.string({
      required: false,
      validate: updateLegalCaseSchema.shape.verdict,
    }),
    legalBasis: t.string({
      required: false,
      validate: updateLegalCaseSchema.shape.legalBasis,
    }),
    caseDate: t.field({
      type: "DateTime",
      required: false,
    }),
    resolutionDate: t.field({
      type: "DateTime",
      required: false,
    }),
    jurisdiction: t.string({
      required: false,
      validate: JurisdictionEnum.optional().nullable(),
    }),
    caseType: t.string({
      required: false,
      validate: CaseTypeEnum.optional().nullable(),
    }),
    courtId: t.string({
      required: false,
      validate: updateLegalCaseSchema.shape.courtId,
    }),
  }),
});
