import type { Jurisdiction } from "@prisma/client/client";
import { handlePrismaError } from "@prisma/lib/error-handler";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { NotFoundError, UnauthorizedError } from "@/lib/errors/gql";
import { generateCaseSlug } from "@/lib/utils/generate-slug";
import { sanitize } from "@/lib/utils/sanitize";
import { CreateLegalCaseInput, UpdateLegalCaseInput } from "./inputs";

builder.mutationField("createLegalCase", (t) =>
  t.prismaField({
    type: "LegalCase",
    authScopes: { collaborator: true },
    args: {
      input: t.arg({
        type: CreateLegalCaseInput,
        required: true,
        description: "Data for creating a new legal case",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { input } = sanitize(rawArgs);

      try {
        return await db.legalCase.create({
          ...query,
          data: {
            caseNumber: input.caseNumber,
            caseName: input.caseName,
            slug: generateCaseSlug(input.caseName, input.caseNumber),
            summary: input.summary,
            parties: input.parties,
            plaintiff: input.plaintiff,
            defendant: input.defendant,
            judges: input.judges,
            verdict: input.verdict,
            legalBasis: input.legalBasis,
            caseDate: input.caseDate,
            resolutionDate: input.resolutionDate,
            jurisdiction: input.jurisdiction as Jurisdiction | undefined,
            caseType: input.caseTypeId
              ? {
                  connect: { id: input.caseTypeId },
                }
              : undefined,
            court: input.courtId
              ? {
                  connect: { id: input.courtId },
                }
              : undefined,
          },
        });
      } catch (error) {
        handlePrismaError(error, {
          duplicate: "Ya existe un caso con el mismo número de expediente",
        });
      }
    },
  }),
);

builder.mutationField("updateLegalCase", (t) =>
  t.prismaField({
    type: "LegalCase",
    authScopes: { collaborator: true },
    args: {
      id: t.arg.string({
        required: true,
        description: "Legal case ID to update",
      }),
      input: t.arg({
        type: UpdateLegalCaseInput,
        required: true,
        description: "Data for updating the legal case",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id, input } = sanitize(rawArgs);

      try {
        const legalCase = await db.legalCase.findUnique({
          where: { id },
        });

        if (!legalCase) {
          throw new NotFoundError("Caso legal no encontrado");
        }

        // Regenerate slug if caseName or caseNumber changes
        const newCaseName = input.caseName ?? legalCase.caseName;
        const newCaseNumber = input.caseNumber ?? legalCase.caseNumber;
        const shouldUpdateSlug = input.caseName || input.caseNumber;

        return await db.legalCase.update({
          ...query,
          where: { id },
          data: {
            ...(input.caseNumber && { caseNumber: input.caseNumber }),
            ...(input.caseName && { caseName: input.caseName }),
            ...(shouldUpdateSlug && {
              slug: generateCaseSlug(newCaseName, newCaseNumber),
            }),
            ...(input.summary !== undefined && { summary: input.summary }),
            ...(input.parties !== undefined && { parties: input.parties }),
            ...(input.plaintiff !== undefined && {
              plaintiff: input.plaintiff,
            }),
            ...(input.defendant !== undefined && {
              defendant: input.defendant,
            }),
            ...(input.judges !== undefined && { judges: input.judges }),
            ...(input.verdict !== undefined && { verdict: input.verdict }),
            ...(input.legalBasis !== undefined && {
              legalBasis: input.legalBasis,
            }),
            ...(input.caseDate !== undefined && { caseDate: input.caseDate }),
            ...(input.resolutionDate !== undefined && {
              resolutionDate: input.resolutionDate,
            }),
            ...(input.jurisdiction !== undefined && {
              jurisdiction: input.jurisdiction as Jurisdiction,
            }),
            ...(input.caseTypeId !== undefined && {
              caseType: input.caseTypeId
                ? {
                    connect: { id: input.caseTypeId },
                  }
                : {
                    disconnect: true,
                  },
            }),
            ...(input.courtId !== undefined && {
              court: input.courtId
                ? {
                    connect: { id: input.courtId },
                  }
                : {
                    disconnect: true,
                  },
            }),
          },
        });
      } catch (error) {
        handlePrismaError(error, {
          duplicate: "Ya existe un caso con el mismo número de expediente",
        });
      }
    },
  }),
);

builder.mutationField("deleteLegalCase", (t) =>
  t.prismaField({
    type: "LegalCase",
    authScopes: { admin: true },
    args: {
      id: t.arg.string({
        required: true,
        description: "Legal case ID to delete",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id } = sanitize(rawArgs);

      try {
        const legalCase = await db.legalCase.findUnique({
          where: { id },
        });

        if (!legalCase) {
          throw new NotFoundError("Caso legal no encontrado");
        }

        return await db.legalCase.delete({
          ...query,
          where: { id },
        });
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);
