import { sanitize } from "@/core/utils/sanitize";
import { caseTypes } from "@/domain/db/schema";
import {
  CASE_TYPE_ENUM_FIELDS,
  CASE_TYPE_SORT_FIELD_MAP,
  CaseTypeFilter,
  CaseTypeSort,
} from "@/modules/business/case-type/inputs";
import { builder } from "@/shared/graphql/builder";
import {
  buildDrizzleOrderBy,
  buildDrizzleSqlWhere,
  buildDrizzleWhere,
} from "@/shared/graphql/filters";
import {
  createDbCountPageInfoResolver,
  PaginationInfo,
} from "@/shared/pagination/model";

const CASE_TYPE_COLUMNS = {
  name: caseTypes.name,
  slug: caseTypes.slug,
  description: caseTypes.description,
  color: caseTypes.color,
  icon: caseTypes.icon,
  order: caseTypes.order,
  active: caseTypes.active,
};

interface CaseTypesConnectionShape {
  take: number;
  skip: number;
  filter?: Record<string, Record<string, unknown>>;
  sort?: { field: string; direction: "ASC" | "DESC" }[];
}

const CaseTypesConnection = builder.objectRef<CaseTypesConnectionShape>(
  "CaseTypesConnection",
);

CaseTypesConnection.implement({
  description: "Paginated list of case types",
  fields: (t) => ({
    items: t.drizzleField({
      type: ["caseTypes"],
      resolve: async (query, parent, _args, ctx) =>
        await ctx.db.query.caseTypes.findMany(
          query({
            where: buildDrizzleWhere(parent.filter, CASE_TYPE_ENUM_FIELDS),
            orderBy: buildDrizzleOrderBy(parent.sort, CASE_TYPE_SORT_FIELD_MAP),
            limit: parent.take,
            offset: parent.skip,
          }),
        ),
    }),
    pageInfo: t.field({
      type: PaginationInfo,
      resolve: createDbCountPageInfoResolver<CaseTypesConnectionShape>({
        source: caseTypes,
        where: (parent) =>
          buildDrizzleSqlWhere(
            parent.filter,
            CASE_TYPE_COLUMNS,
            CASE_TYPE_ENUM_FIELDS,
          ),
      }),
    }),
  }),
});

builder.queryField("caseTypes", (t) =>
  t.field({
    type: CaseTypesConnection,
    description: "Get all case types with pagination",
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of case types to take",
        defaultValue: 50,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of case types to skip",
        defaultValue: 0,
      }),
      filter: t.arg({
        type: CaseTypeFilter,
        required: false,
        description: "Filter case types by fields",
      }),
      sort: t.arg({
        type: [CaseTypeSort],
        required: false,
        description: "Sort case types by fields",
      }),
    },
    resolve: (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      return {
        take: args.take ?? 50,
        skip: args.skip ?? 0,
        filter: args.filter ?? undefined,
        sort: args.sort ?? undefined,
      };
    },
  }),
);

builder.queryField("caseType", (t) =>
  t.drizzleField({
    type: "caseTypes",
    nullable: true,
    description: "Get a single case type by ID or slug",
    args: {
      id: t.arg.string({ required: false }),
      slug: t.arg.string({ required: false }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!args.id && !args.slug) {
        return null;
      }

      return await ctx.db.query.caseTypes.findFirst(
        query({
          where: args.id
            ? { id: args.id }
            : {
                slug: args.slug as string,
              },
        }),
      );
    },
  }),
);
