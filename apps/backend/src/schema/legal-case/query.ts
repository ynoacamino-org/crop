import type { CaseType, Jurisdiction } from "@prisma/client/client";
import { handlePrismaError } from "@prisma/lib/error-handler";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";

builder.queryField("legalCases", (t) =>
  t.prismaField({
    type: ["LegalCase"],
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
      caseType: t.arg.string({
        required: false,
        description: "Filter by case type",
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
    resolve: async (query, _root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        return await db.legalCase.findMany({
          ...query,
          take: args.take,
          skip: args.skip,
          where: {
            ...(args.jurisdiction && {
              jurisdiction: args.jurisdiction as Jurisdiction,
            }),
            ...(args.caseType && {
              caseType: args.caseType as CaseType,
            }),
            ...(args.courtId && {
              courtId: args.courtId,
            }),
            ...(args.search && {
              OR: [
                { caseName: { contains: args.search, mode: "insensitive" } },
                { caseNumber: { contains: args.search, mode: "insensitive" } },
                { parties: { contains: args.search, mode: "insensitive" } },
              ],
            }),
          },
          orderBy: {
            caseDate: "desc",
          },
        });
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
      caseNumber: t.arg.string({
        required: false,
        description: "Legal case number",
      }),
    },
    resolve: async (query, _root, rawArgs) => {
      const args = sanitize(rawArgs);

      if (!args.id && !args.caseNumber) {
        throw new NotFoundError("Se debe proporcionar id o caseNumber");
      }

      try {
        const legalCase = await db.legalCase.findFirst({
          ...query,
          where: args.id ? { id: args.id } : { caseNumber: args.caseNumber },
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
