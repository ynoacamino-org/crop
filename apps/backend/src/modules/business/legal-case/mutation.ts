import { eq } from "drizzle-orm";
import { handleDbError } from "@/core/errors/db";
import { NotFoundError, UnauthorizedError } from "@/core/errors/gql";
import { generateCaseSlug } from "@/core/utils/generate-slug";
import { sanitize } from "@/core/utils/sanitize";
import { caseTypes, courts, legalCases } from "@/domain/db/schema";
import {
  CreateLegalCaseInput,
  UpdateLegalCaseInput,
} from "@/modules/business/legal-case/inputs";
import { builder } from "@/shared/graphql/builder";

builder.mutationField("createLegalCase", (t) =>
  t.drizzleField({
    type: "legalCases",
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
          .returning({ id: legalCases.id });

        if (!createdCase) {
          throw new Error("No se pudo crear el caso legal");
        }

        const result = await ctx.db.query.legalCases.findFirst(
          query({ where: { id: createdCase.id } }),
        );

        if (!result) throw new Error("No se pudo crear el caso legal");

        return result;
      } catch (error) {
        handleDbError(error, {
          duplicate: "Ya existe un caso con el mismo número de expediente",
        });
      }
    },
  }),
);

builder.mutationField("updateLegalCase", (t) =>
  t.drizzleField({
    type: "legalCases",
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

        const newCaseName = input.caseName ?? legalCase.caseName;
        const newCaseNumber = input.caseNumber ?? legalCase.caseNumber;
        const shouldUpdateSlug = input.caseName || input.caseNumber;

        await ctx.db
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
          .where(eq(legalCases.id, id));

        const updatedCase = await ctx.db.query.legalCases.findFirst(
          query({ where: { id } }),
        );

        if (!updatedCase) throw new NotFoundError("Caso legal no encontrado");

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
  t.drizzleField({
    type: "legalCases",
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
        const fullCase = await ctx.db.query.legalCases.findFirst(
          query({ where: { id } }),
        );

        if (!fullCase) {
          throw new NotFoundError("Caso legal no encontrado");
        }

        await ctx.db.delete(legalCases).where(eq(legalCases.id, id));

        return fullCase;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
