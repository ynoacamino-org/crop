import type { CaseType, Jurisdiction } from "@prisma/client/client";
import { handlePrismaError } from "@prisma/lib/error-handler";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { NotFoundError, UnauthorizedError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";
import { CreateLegalCaseInput, UpdateLegalCaseInput } from "./inputs";

builder.mutationField("createLegalCase", (t) =>
  t.prismaField({
    type: "LegalCase",
    authScopes: { admin: true },
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
            caseType: input.caseType as CaseType | undefined,
            ...(input.courtId && {
              courtId: input.courtId,
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

builder.mutationField("updateLegalCase", (t) =>
  t.prismaField({
    type: "LegalCase",
    authScopes: { admin: true },
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

        return await db.legalCase.update({
          ...query,
          where: { id },
          data: {
            ...(input.caseNumber && { caseNumber: input.caseNumber }),
            ...(input.caseName && { caseName: input.caseName }),
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
            ...(input.caseType !== undefined && {
              caseType: input.caseType as CaseType,
            }),
            ...(input.courtId !== undefined && {
              courtId: input.courtId,
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
