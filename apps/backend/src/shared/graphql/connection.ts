import type { Column } from "drizzle-orm";
import { handleDbError } from "@/core/errors/db";
import { sanitize } from "@/core/utils/sanitize";
import { builder } from "@/shared/graphql/builder";
import {
  buildDrizzleOrderBy,
  buildDrizzleSqlWhere,
  buildDrizzleWhere,
} from "@/shared/graphql/filters";
import {
  createDbCountPageInfoResolver,
  PaginationInfo,
} from "@/shared/graphql/pagination";

interface ConnectionShape {
  take: number;
  skip: number;
  filter?: Record<string, Record<string, unknown>>;
  sort?: { field: string; direction: "ASC" | "DESC" }[];
}

interface ConnectionConfig {
  typeName: string;
  description: string;
  table: Parameters<typeof createDbCountPageInfoResolver>[0]["source"];
  itemType: string;
  // biome-ignore lint/suspicious/noExplicitAny: Pothos InputObjectRef has incompatible index signatures
  filterInput: any;
  // biome-ignore lint/suspicious/noExplicitAny: Pothos InputObjectRef has incompatible index signatures
  sortInput: any;
  enumFields: Set<string>;
  fieldMap: Record<string, string>;
  columns: Record<string, Column>;
  defaultTake?: number;
  authScopes?: Record<string, boolean>;
}

export function createConnectionType(config: ConnectionConfig) {
  const ref = builder.objectRef<ConnectionShape>(config.typeName);

  ref.implement({
    description: config.description,
    fields: (t) => ({
      items: t.drizzleField({
        // @ts-expect-error — Pothos requires a literal type name, but this factory is generic
        type: [config.itemType],
        resolve: async (query, parent, _args, ctx) => {
          try {
            // biome-ignore lint/suspicious/noExplicitAny: dynamic table lookup
            const dbQuery = (ctx.db.query as any)[config.itemType];
            return await dbQuery.findMany(
              query({
                where: buildDrizzleWhere(parent.filter, config.enumFields),
                orderBy: buildDrizzleOrderBy(parent.sort, config.fieldMap),
                limit: parent.take,
                offset: parent.skip,
              }),
            );
          } catch (error) {
            handleDbError(error);
          }
        },
      }),
      pageInfo: t.field({
        type: PaginationInfo,
        resolve: createDbCountPageInfoResolver<ConnectionShape>({
          source: config.table,
          where: (parent) =>
            buildDrizzleSqlWhere(
              parent.filter,
              config.columns,
              config.enumFields,
            ),
          onError: handleDbError,
        }),
      }),
    }),
  });

  function listQuery(fieldName: string, description?: string) {
    builder.queryField(fieldName, (t) =>
      t.field({
        type: ref,
        description,
        args: {
          take: t.arg.int({
            required: false,
            description: "Number of items to take",
            defaultValue: config.defaultTake ?? 10,
          }),
          skip: t.arg.int({
            required: false,
            description: "Number of items to skip",
            defaultValue: 0,
          }),
          filter: t.arg({
            type: config.filterInput,
            required: false,
            description: "Filter items by fields",
          }),
          sort: t.arg({
            type: [config.sortInput],
            required: false,
            description: "Sort items by fields",
          }),
        },
        ...(config.authScopes ? { authScopes: config.authScopes } : {}),
        resolve: (_root: unknown, rawArgs: Record<string, unknown>) => {
          const args = sanitize(rawArgs) as {
            take?: number;
            skip?: number;
            filter?: Record<string, Record<string, unknown>>;
            sort?: { field: string; direction: "ASC" | "DESC" }[];
          };

          return {
            take: args.take ?? config.defaultTake ?? 10,
            skip: args.skip ?? 0,
            filter: args.filter ?? undefined,
            sort: args.sort ?? undefined,
          };
        },
      }),
    );
  }

  return { ref, listQuery };
}
