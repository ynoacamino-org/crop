import { caseTypesQuerySchema } from "@repo/schemas";
import { caseTypes } from "@/domain/db/schema";
import { builder } from "@/infrastructure/graphql/builder";
import {
  createDbCountPageInfoResolver,
  PaginationInfo,
} from "@/infrastructure/graphql/schema/pagination/model";
import { sanitize } from "@/infrastructure/lib/utils/sanitize";

interface CaseTypesConnectionShape {
  take: number;
  skip: number;
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
            orderBy: {
              order: "asc",
            },
            limit: parent.take,
            offset: parent.skip,
          }),
        ),
    }),
    pageInfo: t.field({
      type: PaginationInfo,
      resolve: createDbCountPageInfoResolver<CaseTypesConnectionShape>({
        source: caseTypes,
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
        validate: caseTypesQuerySchema.shape.take,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of case types to skip",
        defaultValue: 0,
        validate: caseTypesQuerySchema.shape.skip,
      }),
    },
    resolve: (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      return {
        take: args.take ?? 50,
        skip: args.skip ?? 0,
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
