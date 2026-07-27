import { auditLogs } from "@/domain/db/schema";
import {
  AUDIT_LOG_ENUM_FIELDS,
  AUDIT_LOG_SORT_FIELD_MAP,
  AuditLogFilter,
  AuditLogSort,
} from "@/modules/audit/inputs";
import { createConnectionType } from "@/shared/graphql/connection";

const AUDIT_LOG_COLUMNS = {
  entityType: auditLogs.entityType,
  action: auditLogs.action,
  entityId: auditLogs.entityId,
  userId: auditLogs.userId,
  createdAt: auditLogs.createdAt,
};

const { listQuery } = createConnectionType({
  typeName: "AuditLogsConnection",
  description: "Paginated list of audit log entries",
  table: auditLogs,
  itemType: "auditLogs",
  filterInput: AuditLogFilter,
  sortInput: AuditLogSort,
  enumFields: AUDIT_LOG_ENUM_FIELDS,
  fieldMap: AUDIT_LOG_SORT_FIELD_MAP,
  columns: AUDIT_LOG_COLUMNS,
  defaultTake: 20,
  authScopes: { admin: true },
});

listQuery("auditLogs", "Get audit logs with pagination (admin only)");
