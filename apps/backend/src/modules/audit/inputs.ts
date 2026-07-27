import { builder } from "@/shared/graphql/builder";
import { StringFilter } from "@/shared/graphql/filters";
import { SortDirection } from "@/shared/graphql/sorts";

export const AuditLogFilter = builder.inputType("AuditLogFilter", {
  description: "Filter audit logs by various fields",
  fields: (t) => ({
    entityType: t.field({
      type: StringFilter,
      description:
        "Filter by entity type (Article, LegalCase, User, Media, CaseType)",
    }),
    action: t.field({
      type: StringFilter,
      description: "Filter by action (CREATE, UPDATE, DELETE)",
    }),
    entityId: t.field({
      type: StringFilter,
      description: "Filter by entity ID",
    }),
    userId: t.field({
      type: StringFilter,
      description: "Filter by user who performed the action",
    }),
  }),
});

export const AuditLogSortField = builder.enumType("AuditLogSortField", {
  description: "Fields to sort audit logs by",
  values: ["ENTITY_TYPE", "ACTION", "CREATED_AT"] as const,
});

export const AuditLogSort = builder.inputType("AuditLogSort", {
  description: "Sort configuration for audit logs",
  fields: (t) => ({
    field: t.field({
      type: AuditLogSortField,
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

export const AUDIT_LOG_SORT_FIELD_MAP: Record<string, string> = {
  ENTITY_TYPE: "entityType",
  ACTION: "action",
  CREATED_AT: "createdAt",
};

export const AUDIT_LOG_ENUM_FIELDS = new Set(["entityType", "action"]);
