import type { InputObjectRef } from "@pothos/core";
import type { Column, Table } from "drizzle-orm";
import { handleDbError } from "@/core/errors/db";
import { sanitize } from "@/core/utils/sanitize";
import type { relations } from "@/domain/db/schema";
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

type BuilderTypes = (typeof builder)["$inferSchemaTypes"];

type DrizzleKey = keyof typeof relations;

interface ConnectionShape {
  take: number;
  skip: number;
  filter?: Record<string, Record<string, unknown>>;
  sort?: { field: string; direction: "ASC" | "DESC" }[];
}

interface ConnectionConfig {
  typeName: string;
  description: string;
  table: Table;
  itemType: DrizzleKey;
  filterInput: InputObjectRef<BuilderTypes, object>;
  sortInput: InputObjectRef<BuilderTypes, object>;
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
        type: [config.itemType],
        resolve: async (query, parent, _args, ctx) => {
          try {
            const dbQuery = (
              ctx.db.query as Record<
                DrizzleKey,
                {
                  findMany: (
                    opts: unknown,
                  ) => Promise<readonly Record<string, unknown>[]>;
                }
              >
            )[config.itemType];
            return (await dbQuery.findMany(
              query({
                where: buildDrizzleWhere(parent.filter, config.enumFields),
                orderBy: buildDrizzleOrderBy(parent.sort, config.fieldMap),
                limit: parent.take,
                offset: parent.skip,
              }),
            )) as never;
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
