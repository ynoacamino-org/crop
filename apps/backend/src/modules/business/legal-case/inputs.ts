import { createLegalCaseSchema, updateLegalCaseSchema } from "@repo/schemas";
import { builder } from "@/shared/graphql/builder";
import { DateTimeFilter, StringFilter } from "@/shared/graphql/filters";
import { SortDirection } from "@/shared/graphql/sorts";

export const CreateLegalCaseInput = builder.inputType("CreateLegalCaseInput", {
  fields: (t) => ({
    caseNumber: t.string({
      required: true,
      description: "Unique case number identifier",
    }),
    caseName: t.string({
      required: true,
      description: "Name or title of the legal case",
    }),
    summary: t.string({
      required: false,
      description: "Brief summary of the case",
    }),
    parties: t.string({
      required: false,
      description: "Involved parties in the case",
    }),
    plaintiff: t.string({
      required: false,
      description: "The plaintiff party",
    }),
    defendant: t.string({
      required: false,
      description: "The defendant party",
    }),
    judges: t.string({
      required: false,
      description: "Assigned judges",
    }),
    verdict: t.string({
      required: false,
      description: "Case verdict or resolution",
    }),
    legalBasis: t.string({
      required: false,
      description: "Legal basis or grounds for the case",
    }),
    caseDate: t.field({
      type: "DateTime",
      required: false,
      description: "Date the case was filed",
    }),
    resolutionDate: t.field({
      type: "DateTime",
      required: false,
      description: "Date the case was resolved",
    }),
    jurisdiction: t.string({
      required: false,
      description: "Jurisdiction: NACIONAL, REGIONAL, LOCAL, or INTERNACIONAL",
    }),
    caseTypeId: t.string({
      required: false,
      description: "ID of the related case type",
    }),
    courtId: t.string({
      required: false,
      description: "ID of the related court",
    }),
  }),
  validate: createLegalCaseSchema,
});

export const UpdateLegalCaseInput = builder.inputType("UpdateLegalCaseInput", {
  fields: (t) => ({
    caseNumber: t.string({
      required: false,
      description: "Unique case number identifier",
    }),
    caseName: t.string({
      required: false,
      description: "Name or title of the legal case",
    }),
    summary: t.string({
      required: false,
      description: "Brief summary of the case",
    }),
    parties: t.string({
      required: false,
      description: "Involved parties in the case",
    }),
    plaintiff: t.string({
      required: false,
      description: "The plaintiff party",
    }),
    defendant: t.string({
      required: false,
      description: "The defendant party",
    }),
    judges: t.string({
      required: false,
      description: "Assigned judges",
    }),
    verdict: t.string({
      required: false,
      description: "Case verdict or resolution",
    }),
    legalBasis: t.string({
      required: false,
      description: "Legal basis or grounds for the case",
    }),
    caseDate: t.field({
      type: "DateTime",
      required: false,
      description: "Date the case was filed",
    }),
    resolutionDate: t.field({
      type: "DateTime",
      required: false,
      description: "Date the case was resolved",
    }),
    jurisdiction: t.string({
      required: false,
      description: "Jurisdiction: NACIONAL, REGIONAL, LOCAL, or INTERNACIONAL",
    }),
    caseTypeId: t.string({
      required: false,
      description: "ID of the related case type",
    }),
    courtId: t.string({
      required: false,
      description: "ID of the related court",
    }),
  }),
  validate: updateLegalCaseSchema,
});

export const LegalCaseFilter = builder.inputType("LegalCaseFilter", {
  description: "Filter legal cases by various fields",
  fields: (t) => ({
    caseNumber: t.field({
      type: StringFilter,
      description: "Filter by case number",
    }),
    caseName: t.field({
      type: StringFilter,
      description: "Filter by case name",
    }),
    summary: t.field({
      type: StringFilter,
      description: "Filter by summary",
    }),
    parties: t.field({
      type: StringFilter,
      description: "Filter by parties",
    }),
    plaintiff: t.field({
      type: StringFilter,
      description: "Filter by plaintiff",
    }),
    defendant: t.field({
      type: StringFilter,
      description: "Filter by defendant",
    }),
    jurisdiction: t.field({
      type: StringFilter,
      description:
        "Filter by jurisdiction (NACIONAL, REGIONAL, LOCAL, INTERNACIONAL)",
    }),
    caseTypeId: t.field({
      type: StringFilter,
      description: "Filter by case type ID",
    }),
    courtId: t.field({
      type: StringFilter,
      description: "Filter by court ID",
    }),
    caseDate: t.field({
      type: DateTimeFilter,
      description: "Filter by case date",
    }),
    resolutionDate: t.field({
      type: DateTimeFilter,
      description: "Filter by resolution date",
    }),
  }),
});

export const LegalCaseSortField = builder.enumType("LegalCaseSortField", {
  description: "Fields to sort legal cases by",
  values: [
    "CASE_NUMBER",
    "CASE_NAME",
    "JURISDICTION",
    "CASE_DATE",
    "RESOLUTION_DATE",
    "CREATED_AT",
  ] as const,
});

export const LegalCaseSort = builder.inputType("LegalCaseSort", {
  description: "Sort configuration for legal cases",
  fields: (t) => ({
    field: t.field({
      type: LegalCaseSortField,
      required: true,
      description: "Field to sort by",
    }),
    direction: t.field({
      type: SortDirection,
      required: true,
      description: "Sort direction",
    }),
  }),
});

export const LEGAL_CASE_SORT_FIELD_MAP: Record<string, string> = {
  CASE_NUMBER: "caseNumber",
  CASE_NAME: "caseName",
  JURISDICTION: "jurisdiction",
  CASE_DATE: "caseDate",
  RESOLUTION_DATE: "resolutionDate",
  CREATED_AT: "createdAt",
};

export const LEGAL_CASE_ENUM_FIELDS = new Set(["jurisdiction"]);
