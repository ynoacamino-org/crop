import { handleDbError } from "@/core/errors/db";
import { NotFoundError } from "@/core/errors/gql";
import { sanitize } from "@/core/utils/sanitize";
import { courts } from "@/domain/db/schema";
import {
  COURT_ENUM_FIELDS,
  COURT_SORT_FIELD_MAP,
  CourtFilter,
  CourtSort,
} from "@/modules/business/court/inputs";
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

const COURT_COLUMNS = {
  name: courts.name,
  type: courts.type,
  jurisdiction: courts.jurisdiction,
  description: courts.description,
};

interface CourtsConnectionShape {
  take: number;
  skip: number;
  filter?: Record<string, Record<string, unknown>>;
  sort?: { field: string; direction: "ASC" | "DESC" }[];
}

const CourtsConnection =
  builder.objectRef<CourtsConnectionShape>("CourtsConnection");

CourtsConnection.implement({
  description: "Paginated list of courts",
  fields: (t) => ({
    items: t.drizzleField({
      type: ["courts"],
      resolve: async (query, parent, _args, ctx) => {
        try {
          return await ctx.db.query.courts.findMany(
            query({
              where: buildDrizzleWhere(parent.filter, COURT_ENUM_FIELDS),
              orderBy: buildDrizzleOrderBy(parent.sort, COURT_SORT_FIELD_MAP),
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
      resolve: createDbCountPageInfoResolver<CourtsConnectionShape>({
        source: courts,
        where: (parent) =>
          buildDrizzleSqlWhere(parent.filter, COURT_COLUMNS, COURT_ENUM_FIELDS),
        onError: handleDbError,
      }),
    }),
  }),
});

builder.queryField("courts", (t) =>
  t.field({
    type: CourtsConnection,
    description: "Get all courts with pagination",
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of courts to take",
        defaultValue: 10,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of courts to skip",
        defaultValue: 0,
      }),
      filter: t.arg({
        type: CourtFilter,
        required: false,
        description: "Filter courts by fields",
      }),
      sort: t.arg({
        type: [CourtSort],
        required: false,
        description: "Sort courts by fields",
      }),
    },
    resolve: (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      return {
        take: args.take ?? 10,
        skip: args.skip ?? 0,
        filter: args.filter ?? undefined,
        sort: args.sort ?? undefined,
      };
    },
  }),
);

builder.queryField("court", (t) =>
  t.drizzleField({
    type: "courts",
    nullable: true,
    description: "Get a single court by ID",
    args: {
      id: t.arg.string({
        required: true,
        description: "Court ID",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      const args = sanitize(rawArgs);

      try {
        const court = await ctx.db.query.courts.findFirst(
          query({
            where: {
              id: args.id,
            },
          }),
        );

        if (!court) {
          throw new NotFoundError("Corte no encontrada");
        }

        return court;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
