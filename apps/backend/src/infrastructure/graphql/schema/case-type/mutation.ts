import { eq, sql } from "drizzle-orm";
import { caseTypes, legalCases } from "@/domain/db/schema";
import { builder } from "@/infrastructure/graphql/builder";
import {
  CreateCaseTypeInput,
  createCaseTypeSchema,
  UpdateCaseTypeInput,
  updateCaseTypeSchema,
} from "@/infrastructure/graphql/schema/case-type/inputs";
import { handleDbError } from "@/infrastructure/lib/errors/db";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/infrastructure/lib/errors/gql";
import { sanitize } from "@/infrastructure/lib/utils/sanitize";

builder.mutationField("createCaseType", (t) =>
  t.field({
    type: "CaseType",
    authScopes: { admin: true },
    args: {
      input: t.arg({
        type: CreateCaseTypeInput,
        required: true,
        description: "Data for creating a new case type",
      }),
    },
    resolve: async (_root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { input } = sanitize(rawArgs);

      // Validate with Zod schema
      const validatedInput = createCaseTypeSchema.parse(input);

      try {
        const [createdCaseType] = await ctx.db
          .insert(caseTypes)
          .values({
            name: validatedInput.name,
            slug: validatedInput.slug,
            description: validatedInput.description,
            color: validatedInput.color,
            icon: validatedInput.icon,
            order: validatedInput.order ?? 0,
            active: validatedInput.active ?? true,
          })
          .returning();

        if (!createdCaseType) {
          throw new Error("No se pudo crear el tipo de caso");
        }

        return createdCaseType;
      } catch (error) {
        handleDbError(error, {
          duplicate: "Ya existe un tipo de caso con ese nombre o slug",
        });
      }
    },
  }),
);

builder.mutationField("updateCaseType", (t) =>
  t.field({
    type: "CaseType",
    authScopes: { admin: true },
    args: {
      id: t.arg.string({
        required: true,
        description: "Case type ID to update",
      }),
      input: t.arg({
        type: UpdateCaseTypeInput,
        required: true,
        description: "Data for updating the case type",
      }),
    },
    resolve: async (_root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id, input } = sanitize(rawArgs);

      // Validate with Zod schema
      const validatedInput = updateCaseTypeSchema.parse(input);

      try {
        const [caseType] = await ctx.db
          .select()
          .from(caseTypes)
          .where(eq(caseTypes.id, id))
          .limit(1);

        if (!caseType) {
          throw new NotFoundError("Tipo de caso no encontrado");
        }

        const [updatedCaseType] = await ctx.db
          .update(caseTypes)
          .set({
            ...(validatedInput.name !== undefined && {
              name: validatedInput.name,
            }),
            ...(validatedInput.slug !== undefined && {
              slug: validatedInput.slug,
            }),
            ...(validatedInput.description !== undefined && {
              description: validatedInput.description,
            }),
            ...(validatedInput.color !== undefined && {
              color: validatedInput.color,
            }),
            ...(validatedInput.icon !== undefined && {
              icon: validatedInput.icon,
            }),
            ...(validatedInput.order !== undefined && {
              order: validatedInput.order,
            }),
            ...(validatedInput.active !== undefined && {
              active: validatedInput.active,
            }),
            updatedAt: new Date(),
          })
          .where(eq(caseTypes.id, id))
          .returning();

        if (!updatedCaseType) {
          throw new NotFoundError("Tipo de caso no encontrado");
        }

        return updatedCaseType;
      } catch (error) {
        handleDbError(error, {
          duplicate: "Ya existe un tipo de caso con ese nombre o slug",
        });
      }
    },
  }),
);

builder.mutationField("deleteCaseType", (t) =>
  t.field({
    type: "CaseType",
    authScopes: { admin: true },
    args: {
      id: t.arg.string({
        required: true,
        description: "Case type ID to delete",
      }),
    },
    resolve: async (_root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id } = sanitize(rawArgs);

      try {
        const [caseType] = await ctx.db
          .select()
          .from(caseTypes)
          .where(eq(caseTypes.id, id))
          .limit(1);

        if (!caseType) {
          throw new NotFoundError("Tipo de caso no encontrado");
        }

        const [legalCasesCountRow] = await ctx.db
          .select({ legalCasesCount: sql<number>`count(*)::int` })
          .from(legalCases)
          .where(eq(legalCases.caseTypeId, id));

        const legalCasesCount = legalCasesCountRow?.legalCasesCount ?? 0;

        // Check if case type is being used
        if (legalCasesCount > 0) {
          throw new Error(
            `No se puede eliminar este tipo de caso porque está siendo usado por ${legalCasesCount} caso(s) legal(es)`,
          );
        }

        const [deletedCaseType] = await ctx.db
          .delete(caseTypes)
          .where(eq(caseTypes.id, id))
          .returning();

        if (!deletedCaseType) {
          throw new NotFoundError("Tipo de caso no encontrado");
        }

        return deletedCaseType;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
