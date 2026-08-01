import {
  createCaseTypeSchema,
  updateCaseTypeSchema,
} from "@repo/schemas/case-type";
import { builder } from "@/shared/graphql/builder";
import {
  BooleanFilter,
  IntFilter,
  StringFilter,
} from "@/shared/graphql/filters";
import { SortDirection } from "@/shared/graphql/sorts";

export const CreateCaseTypeInput = builder.inputType("CreateCaseTypeInput", {
  fields: (t) => ({
    name: t.string({
      required: true,
      description: "Case type name (e.g., 'Civil', 'Penal')",
    }),
    slug: t.string({
      required: true,
      description: "URL-friendly slug (e.g., 'civil', 'penal')",
    }),
    description: t.string({
      required: false,
      description: "Optional description of the case type",
    }),
    color: t.string({
      required: false,
      description: "Hex color code for UI display (e.g., '#3B82F6')",
    }),
    icon: t.string({
      required: false,
      description: "Icon name for UI display (e.g., 'FileText')",
    }),
    order: t.int({
      required: false,
      description: "Display order (lower numbers appear first)",
    }),
    active: t.boolean({
      required: false,
      description: "Whether this case type is active",
    }),
  }),
  validate: createCaseTypeSchema,
});

export const UpdateCaseTypeInput = builder.inputType("UpdateCaseTypeInput", {
  fields: (t) => ({
    name: t.string({
      required: false,
      description: "Case type name",
    }),
    slug: t.string({
      required: false,
      description: "URL-friendly slug",
    }),
    description: t.string({
      required: false,
      description: "Description of the case type",
    }),
    color: t.string({
      required: false,
      description: "Hex color code for UI display",
    }),
    icon: t.string({
      required: false,
      description: "Icon name for UI display",
    }),
    order: t.int({
      required: false,
      description: "Display order",
    }),
    active: t.boolean({
      required: false,
      description: "Whether this case type is active",
    }),
  }),
  validate: updateCaseTypeSchema,
});

export const CaseTypeFilter = builder.inputType("CaseTypeFilter", {
  description: "Filter case types by various fields",
  fields: (t) => ({
    name: t.field({ type: StringFilter, description: "Filter by name" }),
    slug: t.field({ type: StringFilter, description: "Filter by slug" }),
    description: t.field({
      type: StringFilter,
      description: "Filter by description",
    }),
    color: t.field({ type: StringFilter, description: "Filter by color" }),
    icon: t.field({ type: StringFilter, description: "Filter by icon" }),
    order: t.field({ type: IntFilter, description: "Filter by order" }),
    active: t.field({
      type: BooleanFilter,
      description: "Filter by active status",
    }),
  }),
});

export const CaseTypeSortField = builder.enumType("CaseTypeSortField", {
  description: "Fields to sort case types by",
  values: ["NAME", "SLUG", "ORDER", "CREATED_AT"] as const,
});

export const CaseTypeSort = builder.inputType("CaseTypeSort", {
  description: "Sort configuration for case types",
  fields: (t) => ({
    field: t.field({
      type: CaseTypeSortField,
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

export const CASE_TYPE_SORT_FIELD_MAP: Record<string, string> = {
  NAME: "name",
  SLUG: "slug",
  ORDER: "order",
  CREATED_AT: "createdAt",
};

export const CASE_TYPE_ENUM_FIELDS = new Set<string>();
