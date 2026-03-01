import { handlePrismaError } from "@prisma/lib/error-handler";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { NotFoundError, UnauthorizedError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";
import {
  CreateCaseTypeInput,
  createCaseTypeSchema,
  UpdateCaseTypeInput,
  updateCaseTypeSchema,
} from "./inputs";

builder.mutationField("createCaseType", (t) =>
  t.prismaField({
    type: "CaseType",
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
        return await db.caseType.create({
          ...query,
          data: {
            name: validatedInput.name,
            slug: validatedInput.slug,
            description: validatedInput.description,
            color: validatedInput.color,
            icon: validatedInput.icon,
            order: validatedInput.order ?? 0,
            active: validatedInput.active ?? true,
          },
        });
      } catch (error) {
        handlePrismaError(error, {
          duplicate: "Ya existe un tipo de caso con ese nombre o slug",
        });
      }
    },
  }),
);

builder.mutationField("updateCaseType", (t) =>
  t.prismaField({
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
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { id, input } = sanitize(rawArgs);

      // Validate with Zod schema
      const validatedInput = updateCaseTypeSchema.parse(input);

      try {
        const caseType = await db.caseType.findUnique({
          where: { id },
        });

        if (!caseType) {
          throw new NotFoundError("Tipo de caso no encontrado");
        }

        return await db.caseType.update({
          ...query,
          where: { id },
          data: {
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
          },
        });
      } catch (error) {
        handlePrismaError(error, {
          duplicate: "Ya existe un tipo de caso con ese nombre o slug",
        });
      }
    },
  }),
);

builder.mutationField("deleteCaseType", (t) =>
  t.prismaField({
    type: "CaseType",
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
        const caseType = await db.caseType.findUnique({
          where: { id },
          include: {
            _count: {
              select: { legalCases: true },
            },
          },
        });

        if (!caseType) {
          throw new NotFoundError("Tipo de caso no encontrado");
        }

        // Check if case type is being used
        if (caseType._count.legalCases > 0) {
          throw new Error(
            `No se puede eliminar este tipo de caso porque está siendo usado por ${caseType._count.legalCases} caso(s) legal(es)`,
          );
        }

        return await db.caseType.delete({
          ...query,
          where: { id },
        });
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);
