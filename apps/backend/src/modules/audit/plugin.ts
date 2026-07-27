import { eq } from "drizzle-orm";
import type { GraphQLResolveInfo } from "graphql";
import {
  type AuditableEntityValue,
  articles,
  auditLogs,
  caseTypes,
  legalCases,
  media,
  users,
} from "@/domain/db/schema";
import type { AppContextShape } from "@/shared/graphql/builder";

interface EntityMapping {
  table:
    | typeof articles
    | typeof legalCases
    | typeof users
    | typeof media
    | typeof caseTypes;
  getId: (args: Record<string, unknown>) => string | undefined;
}

const AUDITABLE_ENTITIES: Record<string, EntityMapping> = {
  Article: {
    table: articles,
    getId: (args) =>
      (args.id as string) ??
      ((args.input as Record<string, unknown>)?.id as string),
  },
  LegalCase: {
    table: legalCases,
    getId: (args) =>
      (args.id as string) ??
      ((args.input as Record<string, unknown>)?.id as string),
  },
  User: {
    table: users,
    getId: (args) =>
      (args.id as string) ??
      ((args.input as Record<string, unknown>)?.id as string),
  },
  Media: {
    table: media,
    getId: (args) =>
      (args.id as string) ??
      ((args.input as Record<string, unknown>)?.id as string),
  },
  CaseType: {
    table: caseTypes,
    getId: (args) =>
      (args.id as string) ??
      ((args.input as Record<string, unknown>)?.id as string),
  },
};

function getActionFromFieldName(
  fieldName: string,
): "CREATE" | "UPDATE" | "DELETE" | null {
  if (fieldName.startsWith("create")) return "CREATE";
  if (fieldName.startsWith("update")) return "UPDATE";
  if (fieldName.startsWith("delete")) return "DELETE";
  return null;
}

function getEntityNameFromMutation(fieldName: string): string | null {
  const prefixes = ["create", "update", "delete"] as const;
  for (const prefix of prefixes) {
    if (fieldName.startsWith(prefix)) {
      const rest = fieldName.slice(prefix.length);
      if (rest.length > 0) {
        return rest.charAt(0).toUpperCase() + rest.slice(1);
      }
    }
  }
  return null;
}

async function getOldEntity(
  db: AppContextShape["db"],
  entityType: string,
  entityId: string,
): Promise<Record<string, unknown> | undefined> {
  const mapping = AUDITABLE_ENTITIES[entityType];
  if (!mapping) return undefined;

  try {
    const [row] = await db
      .select()
      .from(mapping.table)
      .where(eq(mapping.table.id, entityId))
      .limit(1);
    return row as Record<string, unknown> | undefined;
  } catch {
    return undefined;
  }
}

function serializeValues(
  values: Record<string, unknown> | undefined,
): string | undefined {
  if (!values) return undefined;
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (key === "__proto__" || key === "constructor") continue;
    if (value instanceof Date) {
      cleaned[key] = value.toISOString();
    } else if (value !== null && value !== undefined) {
      cleaned[key] = value;
    }
  }
  return JSON.stringify(cleaned);
}

function createAuditLogEntry(params: {
  entityType: AuditableEntityValue;
  entityId: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  userId?: string;
  userName?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  return {
    id: crypto.randomUUID(),
    entityType: params.entityType,
    entityId: params.entityId,
    action: params.action,
    userId: params.userId ?? undefined,
    userName: params.userName ?? undefined,
    oldValues: serializeValues(params.oldValues),
    newValues: serializeValues(params.newValues),
    ipAddress: params.ipAddress ?? undefined,
    userAgent: params.userAgent ?? undefined,
    createdAt: new Date(),
  };
}

// biome-ignore lint/suspicious/noExplicitAny: Pothos tracing plugin types
type Resolver = (...args: any[]) => any;
type FieldConfig = { kind: string; name?: string };

export function isAuditableMutation(fieldName: string): boolean {
  return getActionFromFieldName(fieldName) !== null;
}

export function createAuditTracingConfig() {
  return {
    default: (config: { kind: string; name?: string }) => {
      if (
        config.kind === "Mutation" &&
        config.name &&
        isAuditableMutation(config.name)
      ) {
        return true;
      }
      return false;
    },
    wrap: (
      _resolver: Resolver,
      _options: unknown,
      fieldConfig: FieldConfig,
    ) => {
      if (fieldConfig.kind !== "Mutation" || !fieldConfig.name) {
        return _resolver;
      }

      const mutationName = fieldConfig.name;
      const action = getActionFromFieldName(mutationName);

      if (!action) return _resolver;

      return (
        source: unknown,
        args: Record<string, unknown>,
        ctx: AppContextShape,
        info: GraphQLResolveInfo,
      ) => {
        const entityName = getEntityNameFromMutation(mutationName);
        const mapping = entityName ? AUDITABLE_ENTITIES[entityName] : undefined;

        if (!mapping) return _resolver(source, args, ctx, info);

        const entityIdFallback =
          entityName === "User" ? (ctx.user?.id ?? undefined) : undefined;

        const entityId: string | undefined =
          ((args.id as string | null | undefined) ?? undefined) ||
          (((args.input as Record<string, unknown>)?.id as
            | string
            | null
            | undefined) ??
            undefined) ||
          entityIdFallback;

        const performAudit = async () => {
          let oldValues: Record<string, unknown> | undefined;
          if ((action === "UPDATE" || action === "DELETE") && entityId) {
            oldValues = await getOldEntity(
              ctx.db,
              String(entityName),
              entityId,
            );
          }

          const result = await _resolver(source, args, ctx, info);

          const resultEntityId =
            entityId ??
            ((result as Record<string, unknown>)?.id as string | undefined);

          if (!resultEntityId) return result;

          const newValues =
            action === "CREATE" || action === "UPDATE"
              ? (result as Record<string, unknown>)
              : undefined;

          const entry = createAuditLogEntry({
            entityType: entityName as AuditableEntityValue,
            entityId: resultEntityId,
            action,
            userId: ctx.user?.id,
            userName: ctx.user?.email,
            oldValues,
            newValues,
          });

          try {
            await ctx.db.insert(auditLogs).values([entry]);
          } catch (err: unknown) {
            // biome-ignore lint/suspicious/noConsole: We want to log this error for debugging purposes
            console.error("[AuditLog] insert failed:", err);
          }

          return result;
        };

        return performAudit();
      };
    },
  };
}

export { AUDITABLE_ENTITIES };
