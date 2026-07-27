import { eq, sql } from "drizzle-orm";
import { handleDbError } from "@/core/errors/db";
import { NotFoundError, UnauthorizedError } from "@/core/errors/gql";
import { sanitize } from "@/core/utils/sanitize";
import { caseTypes, legalCases } from "@/domain/db/schema";
import {
  CreateCaseTypeInput,
  createCaseTypeSchema,
  UpdateCaseTypeInput,
  updateCaseTypeSchema,
} from "@/modules/business/case-type/inputs";
import { builder } from "@/shared/graphql/builder";

builder.mutationField("createCaseType", (t) =>
  t.drizzleField({
    type: "caseTypes",
    authScopes: { admin: true },
    args: {
      input: t.arg({
        type: CreateCaseTypeInput,
        required: true,
        description: "Data for creating a new case type",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
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
          .returning({ id: caseTypes.id });

        if (!createdCaseType) {
          throw new Error("No se pudo crear el tipo de caso");
        }

        const result = await ctx.db.query.caseTypes.findFirst(
          query({ where: { id: createdCaseType.id } }),
        );

        if (!result) throw new Error("No se pudo crear el tipo de caso");

        return result;
      } catch (error) {
        handleDbError(error, {
          duplicate: "Ya existe un tipo de caso con ese nombre o slug",
        });
      }
    },
  }),
);

builder.mutationField("updateCaseType", (t) =>
  t.drizzleField({
    type: "caseTypes",
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
    resolve: async (query, _root, rawArgs, ctx) => {
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

        await ctx.db
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
          .where(eq(caseTypes.id, id));

        const updatedCaseType = await ctx.db.query.caseTypes.findFirst(
          query({ where: { id } }),
        );

        if (!updatedCaseType)
          throw new NotFoundError("Tipo de caso no encontrado");

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
  t.drizzleField({
    type: "caseTypes",
    authScopes: { admin: true },
    args: {
      id: t.arg.string({
        required: true,
        description: "Case type ID to delete",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id } = sanitize(rawArgs);

      try {
        const fullCaseType = await ctx.db.query.caseTypes.findFirst(
          query({ where: { id } }),
        );

        if (!fullCaseType) {
          throw new NotFoundError("Tipo de caso no encontrado");
        }

        const [legalCasesCountRow] = await ctx.db
          .select({ legalCasesCount: sql<number>`count(*)` })
          .from(legalCases)
          .where(eq(legalCases.caseTypeId, id));

        const legalCasesCount = legalCasesCountRow?.legalCasesCount ?? 0;

        // Check if case type is being used
        if (legalCasesCount > 0) {
          throw new Error(
            `No se puede eliminar este tipo de caso porque está siendo usado por ${legalCasesCount} caso(s) legal(es)`,
          );
        }

        await ctx.db.delete(caseTypes).where(eq(caseTypes.id, id));

        return fullCaseType;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
