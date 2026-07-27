import {
  AUDIT_ACTION_VALUES,
  AUDITABLE_ENTITY_VALUES,
} from "@/domain/db/schema";
import { builder } from "@/shared/graphql/builder";

const AuditActionEnum = builder.enumType("AuditAction", {
  values: AUDIT_ACTION_VALUES,
});

const EntityTypeEnum = builder.enumType("EntityType", {
  values: AUDITABLE_ENTITY_VALUES,
});

builder.drizzleObject("auditLogs", {
  name: "AuditLog",
  description: "Audit log entry tracking mutations on auditable entities",
  fields: (t) => ({
    id: t.exposeID("id"),
    entityType: t.field({
      type: EntityTypeEnum,
      resolve: (audit) => audit.entityType,
    }),
    entityId: t.exposeString("entityId"),
    action: t.field({
      type: AuditActionEnum,
      resolve: (audit) => audit.action,
    }),
    user: t.relation("user"),
    userName: t.exposeString("userName", { nullable: true }),
    oldValues: t.exposeString("oldValues", { nullable: true }),
    newValues: t.exposeString("newValues", { nullable: true }),
    ipAddress: t.exposeString("ipAddress", { nullable: true }),
    userAgent: t.exposeString("userAgent", { nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
  }),
});
