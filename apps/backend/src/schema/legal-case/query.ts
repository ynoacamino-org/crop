import type { Jurisdiction, Prisma } from "@prisma/client/client";
import { handlePrismaError } from "@prisma/lib/error-handler";
import { builder } from "@/builder";
import { db } from "@/lib/db";
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

      const whereClause = {
        ...(args.jurisdiction && {
          jurisdiction: args.jurisdiction as Jurisdiction,
        }),
        ...(args.caseTypeId && {
          caseTypeId: args.caseTypeId,
        }),
        ...(args.courtId && {
          courtId: args.courtId,
        }),
        ...(args.search && {
          OR: [
            {
              caseName: {
                contains: args.search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              caseNumber: {
                contains: args.search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              parties: {
                contains: args.search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          ],
        }),
      };

      try {
        const [items, totalCount] = await Promise.all([
          db.legalCase.findMany({
            take: args.take,
            skip: args.skip,
            where: whereClause,
            orderBy: {
              caseDate: "desc",
            },
            include: {
              court: true,
            },
          }),
          db.legalCase.count({
            where: whereClause,
          }),
        ]);

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
        handlePrismaError(error);
      }
    },
  }),
);

builder.queryField("legalCase", (t) =>
  t.prismaField({
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
    resolve: async (query, _root, rawArgs) => {
      const args = sanitize(rawArgs);

      if (!args.id && !args.slug && !args.caseNumber) {
        throw new NotFoundError("Se debe proporcionar id, slug o caseNumber");
      }

      try {
        const legalCase = await db.legalCase.findFirst({
          ...query,
          where: args.id
            ? { id: args.id }
            : args.slug
              ? { slug: args.slug }
              : { caseNumber: args.caseNumber },
        });

        if (!legalCase) {
          throw new NotFoundError("Caso legal no encontrado");
        }

        return legalCase;
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);
