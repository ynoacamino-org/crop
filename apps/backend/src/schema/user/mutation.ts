import { handlePrismaError } from "@prisma/lib/error-handler";
import {
  DeleteUserPayloadSchema,
  UpdateUserPayloadSchema,
} from "@repo/schemas";
import { builder } from "@/builder";
import { db } from "@/db";
import { UNAUTHORIZED_ERROR } from "@/lib/errors";
import { AdminUpdateUserInput, UpdateUserInput } from "./inputs";

builder.mutationField("updateMe", (t) =>
  t.prismaField({
    type: "User",
    args: {
      input: t.arg({ type: UpdateUserInput, required: true }),
    },
    authScopes: {
      public: true,
    },
    resolve: async (query, _root, { input }, ctx) => {
      if (!ctx.user) throw new UNAUTHORIZED_ERROR();

      try {
        return await db.user.update({
          ...query,
          where: { id: ctx.user.id },
          data: {
            name: input.name ?? undefined,
            image: input.image ?? undefined,
          },
        });
      } catch (error) {
        handlePrismaError(error, {
          notFound: "Usuario no encontrado",
          duplicate: "Ya existe un usuario con los mismos valores en",
        });
      }
    },
  }),
);

builder.mutationField("updateUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      id: t.arg.id({
        required: true,
        validate: UpdateUserPayloadSchema.shape.id,
      }),
      input: t.arg({ type: AdminUpdateUserInput, required: true }),
    },
    authScopes: {
      admin: true,
    },
    resolve: async (query, _root, { id, input }) => {
      try {
        return await db.user.update({
          ...query,
          where: { id: id },
          data: {
            name: input.name ?? undefined,
            image: input.image ?? undefined,
            role: input.role ?? undefined,
          },
        });
      } catch (error) {
        handlePrismaError(error, {
          notFound: "El usuario que intenta actualizar no existe",
          duplicate: "Ya existe un usuario con los mismos valores en",
        });
      }
    },
  }),
);

builder.mutationField("deleteMe", (t) =>
  t.prismaField({
    type: "User",
    authScopes: {
      public: true,
    },
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.user) throw new UNAUTHORIZED_ERROR();

      try {
        return await db.user.delete({
          ...query,
          where: { id: ctx.user.id },
        });
      } catch (error) {
        handlePrismaError(error, {
          notFound: "Usuario no encontrado",
          foreignKey:
            "No se puede eliminar el usuario porque tiene datos relacionados",
        });
      }
    },
  }),
);

builder.mutationField("deleteUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      id: t.arg.id({
        required: true,
        validate: DeleteUserPayloadSchema.shape.id,
      }),
    },
    authScopes: {
      admin: true,
    },
    resolve: async (query, _root, { id }) => {
      try {
        return await db.user.delete({
          ...query,
          where: { id },
        });
      } catch (error) {
        handlePrismaError(error, {
          notFound: "El usuario que intenta eliminar no existe",
          foreignKey:
            "No se puede eliminar el usuario porque tiene datos relacionados",
        });
      }
    },
  }),
);
