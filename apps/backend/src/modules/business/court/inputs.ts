import { builder } from "@/shared/graphql/builder";
import { StringFilter } from "@/shared/graphql/filters";
import { SortDirection } from "@/shared/graphql/sorts";

// --- Filter ---

export const CourtFilter = builder.inputType("CourtFilter", {
  description: "Filter courts by various fields",
  fields: (t) => ({
    name: t.field({ type: StringFilter, description: "Filter by name" }),
    type: t.field({
      type: StringFilter,
      description:
        "Filter by type (SUPREMA, SUPERIOR, PRIMERA_INSTANCIA, ESPECIALIZADA, CONSTITUCIONAL)",
    }),
    jurisdiction: t.field({
      type: StringFilter,
      description:
        "Filter by jurisdiction (NACIONAL, REGIONAL, LOCAL, INTERNACIONAL)",
    }),
    description: t.field({
      type: StringFilter,
      description: "Filter by description",
    }),
  }),
});

// --- Sort ---

export const CourtSortField = builder.enumType("CourtSortField", {
  description: "Fields to sort courts by",
  values: ["NAME", "TYPE", "JURISDICTION", "CREATED_AT"] as const,
});

export const CourtSort = builder.inputType("CourtSort", {
  description: "Sort configuration for courts",
  fields: (t) => ({
    field: t.field({
      type: CourtSortField,
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

export const COURT_SORT_FIELD_MAP: Record<string, string> = {
  NAME: "name",
  TYPE: "type",
  JURISDICTION: "jurisdiction",
  CREATED_AT: "createdAt",
};

export const COURT_ENUM_FIELDS = new Set(["type", "jurisdiction"]);
