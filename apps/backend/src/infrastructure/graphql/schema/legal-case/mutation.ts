import { eq } from "drizzle-orm";
import { caseTypes, courts, legalCases } from "@/domain/db/schema";
import { builder } from "@/infrastructure/graphql/builder";
import { handleDbError } from "@/infrastructure/lib/errors/db";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/infrastructure/lib/errors/gql";
import { generateCaseSlug } from "@/infrastructure/lib/utils/generate-slug";
import { sanitize } from "@/infrastructure/lib/utils/sanitize";
import { CreateLegalCaseInput, UpdateLegalCaseInput } from "./inputs";

builder.mutationField("createLegalCase", (t) =>
  t.field({
    type: "LegalCase",
    authScopes: { collaborator: true },
    args: {
      input: t.arg({
        type: CreateLegalCaseInput,
        required: true,
        description: "Data for creating a new legal case",
      }),
    },
    resolve: async (_root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { input } = sanitize(rawArgs);

      try {
        if (input.caseTypeId) {
          const [existingCaseType] = await ctx.db
            .select({ id: caseTypes.id })
            .from(caseTypes)
            .where(eq(caseTypes.id, input.caseTypeId))
            .limit(1);

          if (!existingCaseType) {
            throw new NotFoundError("Tipo de caso no encontrado");
          }
        }

        if (input.courtId) {
          const [existingCourt] = await ctx.db
            .select({ id: courts.id })
            .from(courts)
            .where(eq(courts.id, input.courtId))
            .limit(1);

          if (!existingCourt) {
            throw new NotFoundError("Corte no encontrada");
          }
        }

        const [createdCase] = await ctx.db
          .insert(legalCases)
          .values({
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
            jurisdiction:
              input.jurisdiction as typeof legalCases.$inferInsert.jurisdiction,
            caseTypeId: input.caseTypeId,
            courtId: input.courtId,
          })
          .returning();

        if (!createdCase) {
          throw new Error("No se pudo crear el caso legal");
        }

        return createdCase;
      } catch (error) {
        handleDbError(error, {
          duplicate: "Ya existe un caso con el mismo número de expediente",
        });
      }
    },
  }),
);

builder.mutationField("updateLegalCase", (t) =>
  t.field({
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
    resolve: async (_root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id, input } = sanitize(rawArgs);

      try {
        const [legalCase] = await ctx.db
          .select()
          .from(legalCases)
          .where(eq(legalCases.id, id))
          .limit(1);

        if (!legalCase) {
          throw new NotFoundError("Caso legal no encontrado");
        }

        if (input.caseTypeId) {
          const [existingCaseType] = await ctx.db
            .select({ id: caseTypes.id })
            .from(caseTypes)
            .where(eq(caseTypes.id, input.caseTypeId))
            .limit(1);

          if (!existingCaseType) {
            throw new NotFoundError("Tipo de caso no encontrado");
          }
        }

        if (input.courtId) {
          const [existingCourt] = await ctx.db
            .select({ id: courts.id })
            .from(courts)
            .where(eq(courts.id, input.courtId))
            .limit(1);

          if (!existingCourt) {
            throw new NotFoundError("Corte no encontrada");
          }
        }

        // Regenerate slug if caseName or caseNumber changes
        const newCaseName = input.caseName ?? legalCase.caseName;
        const newCaseNumber = input.caseNumber ?? legalCase.caseNumber;
        const shouldUpdateSlug = input.caseName || input.caseNumber;

        const [updatedCase] = await ctx.db
          .update(legalCases)
          .set({
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
              jurisdiction:
                input.jurisdiction as typeof legalCases.$inferInsert.jurisdiction,
            }),
            ...(input.caseTypeId !== undefined && {
              caseTypeId: input.caseTypeId ?? null,
            }),
            ...(input.courtId !== undefined && {
              courtId: input.courtId ?? null,
            }),
            updatedAt: new Date(),
          })
          .where(eq(legalCases.id, id))
          .returning();

        if (!updatedCase) {
          throw new NotFoundError("Caso legal no encontrado");
        }

        return updatedCase;
      } catch (error) {
        handleDbError(error, {
          duplicate: "Ya existe un caso con el mismo número de expediente",
        });
      }
    },
  }),
);

builder.mutationField("deleteLegalCase", (t) =>
  t.field({
    type: "LegalCase",
    authScopes: { admin: true },
    args: {
      id: t.arg.string({
        required: true,
        description: "Legal case ID to delete",
      }),
    },
    resolve: async (_root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id } = sanitize(rawArgs);

      try {
        const [legalCase] = await ctx.db
          .select()
          .from(legalCases)
          .where(eq(legalCases.id, id))
          .limit(1);

        if (!legalCase) {
          throw new NotFoundError("Caso legal no encontrado");
        }

        const [deletedCase] = await ctx.db
          .delete(legalCases)
          .where(eq(legalCases.id, id))
          .returning();

        if (!deletedCase) {
          throw new NotFoundError("Caso legal no encontrado");
        }

        return deletedCase;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
