import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { builder } from "@/builder";
import { legalCases } from "@/db/schema";
import { db } from "@/lib/db";
import { handleDbError } from "@/lib/errors/db";
import { NotFoundError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";
import {
  calculatePaginationInfo,
  createPaginatedResponse,
} from "@/schema/pagination/model";

// Create paginated type for legal cases
const LegalCasesConnection = createPaginatedResponse("LegalCases", "LegalCase");

builder.queryField("legalCases", (t) =>
  t.field({
    type: LegalCasesConnection,
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of cases to take",
        defaultValue: 10,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of cases to skip",
        defaultValue: 0,
      }),
      jurisdiction: t.arg.string({
        required: false,
        description: "Filter by jurisdiction",
      }),
      caseTypeId: t.arg.string({
        required: false,
        description: "Filter by case type ID",
      }),
      courtId: t.arg.string({
        required: false,
        description: "Filter by court ID",
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for case name, case number, or parties",
      }),
    },
    resolve: async (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      const whereClause = and(
        ...(args.jurisdiction
          ? [
              eq(
                legalCases.jurisdiction,
                args.jurisdiction as Exclude<
                  typeof legalCases.$inferSelect.jurisdiction,
                  null
                >,
              ),
            ]
          : []),
        ...(args.caseTypeId
          ? [eq(legalCases.caseTypeId, args.caseTypeId)]
          : []),
        ...(args.courtId ? [eq(legalCases.courtId, args.courtId)] : []),
        ...(args.search
          ? [
              or(
                ilike(legalCases.caseName, `%${args.search}%`),
                ilike(legalCases.caseNumber, `%${args.search}%`),
                ilike(legalCases.parties, `%${args.search}%`),
              ),
            ]
          : []),
      );

      try {
        const [items, totalCountRows] = await Promise.all([
          db
            .select()
            .from(legalCases)
            .where(whereClause)
            .orderBy(desc(legalCases.caseDate))
            .limit(args.take ?? 10)
            .offset(args.skip ?? 0),
          db
            .select({ totalCount: sql<number>`count(*)::int` })
            .from(legalCases)
            .where(whereClause),
        ]);

        const totalCount = totalCountRows[0]?.totalCount ?? 0;

        const pageInfo = calculatePaginationInfo({
          totalCount,
          take: args.take ?? 10,
          skip: args.skip ?? 0,
        });

        return {
          items,
          pageInfo,
        };
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);

builder.queryField("legalCase", (t) =>
  t.field({
    type: "LegalCase",
    args: {
      id: t.arg.string({
        required: false,
        description: "Legal case ID",
      }),
      slug: t.arg.string({
        required: false,
        description: "Legal case slug",
      }),
      caseNumber: t.arg.string({
        required: false,
        description: "Legal case number",
      }),
    },
    resolve: async (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      if (!args.id && !args.slug && !args.caseNumber) {
        throw new NotFoundError("Se debe proporcionar id, slug o caseNumber");
      }

      try {
        const [legalCase] = await db
          .select()
          .from(legalCases)
          .where(
            args.id
              ? eq(legalCases.id, args.id)
              : args.slug
                ? eq(legalCases.slug, args.slug)
                : eq(legalCases.caseNumber, args.caseNumber as string),
          )
          .limit(1);

        if (!legalCase) {
          throw new NotFoundError("Caso legal no encontrado");
        }

        return legalCase;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
