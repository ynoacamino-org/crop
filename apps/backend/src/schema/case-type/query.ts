import { caseTypesQuerySchema } from "@repo/schemas";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { sanitize } from "@/lib/utils/sanitize";
import {
  calculatePaginationInfo,
  createPaginatedResponse,
} from "@/schema/pagination/model";

// Create paginated type for case types
const CaseTypesConnection = createPaginatedResponse("CaseTypes", "CaseType");

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
      includeInactive: t.arg.boolean({
        required: false,
        description: "Include inactive case types",
        defaultValue: false,
      }),
    },
    resolve: async (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      const whereClause = args.includeInactive ? undefined : { active: true };

      const [items, totalCount] = await Promise.all([
        db.caseType.findMany({
          take: args.take,
          skip: args.skip,
          where: whereClause,
          orderBy: {
            order: "asc",
          },
        }),
        db.caseType.count({ where: whereClause }),
      ]);

      const pageInfo = calculatePaginationInfo({
        totalCount,
        take: args.take ?? 50,
        skip: args.skip ?? 0,
      });

      return {
        items,
        pageInfo,
      };
    },
  }),
);

builder.queryField("caseType", (t) =>
  t.prismaField({
    type: "CaseType",
    nullable: true,
    description: "Get a single case type by ID or slug",
    args: {
      id: t.arg.string({ required: false }),
      slug: t.arg.string({ required: false }),
    },
    resolve: async (query, _root, args) => {
      if (!args.id && !args.slug) {
        return null;
      }

      return db.caseType.findFirst({
        ...query,
        where: args.id
          ? { id: args.id }
          : args.slug
            ? { slug: args.slug }
            : undefined,
      });
    },
  }),
);
