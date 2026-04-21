import { caseTypesQuerySchema } from "@repo/schemas";
import { asc, eq, sql } from "drizzle-orm";
import { builder } from "@/builder";
import { caseTypes } from "@/db/schema";
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

      const whereClause = args.includeInactive
        ? undefined
        : eq(caseTypes.active, true);

      const [items, totalCountRows] = await Promise.all([
        db
          .select()
          .from(caseTypes)
          .where(whereClause)
          .orderBy(asc(caseTypes.order))
          .limit(args.take ?? 50)
          .offset(args.skip ?? 0),
        db
          .select({ totalCount: sql<number>`count(*)::int` })
          .from(caseTypes)
          .where(whereClause),
      ]);

      const totalCount = totalCountRows[0]?.totalCount ?? 0;

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
  t.field({
    type: "CaseType",
    nullable: true,
    description: "Get a single case type by ID or slug",
    args: {
      id: t.arg.string({ required: false }),
      slug: t.arg.string({ required: false }),
    },
    resolve: async (_root, args) => {
      if (!args.id && !args.slug) {
        return null;
      }

      const [caseType] = await db
        .select()
        .from(caseTypes)
        .where(
          args.id
            ? eq(caseTypes.id, args.id)
            : eq(caseTypes.slug, args.slug as string),
        )
        .limit(1);

      return caseType ?? null;
    },
  }),
);
