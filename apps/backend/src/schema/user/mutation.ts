import { handlePrismaError } from "@prisma/lib/error-handler";
import {
  DeleteUserPayloadSchema,
  UpdateUserPayloadSchema,
} from "@repo/schemas";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { UnauthorizedError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";
import { AdminUpdateUserInput, UpdateUserInput } from "./inputs";

builder.mutationField("updateMe", (t) =>
  t.prismaField({
    type: "User",
    args: {
      input: t.arg({
        type: UpdateUserInput,
        required: true,
        description: "Data for updating current user profile",
      }),
    },
    authScopes: {
      public: true,
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { input } = sanitize(rawArgs);

      try {
        return await db.user.update({
          ...query,
          where: { id: ctx.user.id },
          data: {
            name: input.name,
            image: input.image,
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
        description: "ID of the user to update",
        validate: UpdateUserPayloadSchema.shape.id,
      }),
      input: t.arg({
        type: AdminUpdateUserInput,
        required: true,
        description: "Data for updating the user (admin only)",
      }),
    },
    authScopes: {
      admin: true,
    },
    resolve: async (query, _root, rawArgs) => {
      const { id, input } = sanitize(rawArgs);

      try {
        return await db.user.update({
          ...query,
          where: { id: id },
          data: {
            name: input.name,
            image: input.image,
            role: input.role,
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
      if (!ctx.user) throw new UnauthorizedError();

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
        description: "ID of the user to delete",
      }),
    },
    authScopes: {
      admin: true,
    },
    resolve: async (query, _root, rawArgs) => {
      const { id } = sanitize(rawArgs);

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
