import {
  DeleteUserPayloadSchema,
  UpdateUserPayloadSchema,
} from "@repo/schemas";
import { eq } from "drizzle-orm";
import { handleDbError } from "@/core/errors/db";
import { UnauthorizedError } from "@/core/errors/gql";
import { sanitize } from "@/core/utils/sanitize";
import { users } from "@/domain/db/schema";
import {
  AdminUpdateUserInput,
  UpdateUserInput,
} from "@/modules/business/user/inputs";
import { builder } from "@/shared/graphql/builder";

builder.mutationField("updateMe", (t) =>
  t.field({
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
    resolve: async (_root, rawArgs, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const { input } = sanitize(rawArgs);

      try {
        const [updatedUser] = await ctx.db
          .update(users)
          .set({
            ...(input.name !== undefined && { name: input.name }),
            ...(input.image !== undefined && { image: input.image }),
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.user.id))
          .returning();

        if (!updatedUser) {
          throw new Error("Usuario no encontrado");
        }

        return updatedUser;
      } catch (error) {
        handleDbError(error, {
          notFound: "Usuario no encontrado",
          duplicate: "Ya existe un usuario con los mismos valores en",
        });
      }
    },
  }),
);

builder.mutationField("updateUser", (t) =>
  t.field({
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
    resolve: async (_root, rawArgs, ctx) => {
      const { id, input } = sanitize(rawArgs);

      try {
        const [updatedUser] = await ctx.db
          .update(users)
          .set({
            ...(input.name !== undefined && { name: input.name }),
            ...(input.image !== undefined && { image: input.image }),
            ...(input.role !== undefined && {
              role: input.role as "PUBLIC" | "COLLABORATOR" | "ADMIN",
            }),
            updatedAt: new Date(),
          })
          .where(eq(users.id, String(id)))
          .returning();

        if (!updatedUser) {
          throw new Error("El usuario que intenta actualizar no existe");
        }

        return updatedUser;
      } catch (error) {
        handleDbError(error, {
          notFound: "El usuario que intenta actualizar no existe",
          duplicate: "Ya existe un usuario con los mismos valores en",
        });
      }
    },
  }),
);

builder.mutationField("deleteMe", (t) =>
  t.field({
    type: "User",
    authScopes: {
      public: true,
    },
    resolve: async (_root, _args, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      try {
        const [deletedUser] = await ctx.db
          .delete(users)
          .where(eq(users.id, ctx.user.id))
          .returning();

        if (!deletedUser) {
          throw new Error("Usuario no encontrado");
        }

        return deletedUser;
      } catch (error) {
        handleDbError(error, {
          notFound: "Usuario no encontrado",
          foreignKey:
            "No se puede eliminar el usuario porque tiene datos relacionados",
        });
      }
    },
  }),
);

builder.mutationField("deleteUser", (t) =>
  t.field({
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
    resolve: async (_root, rawArgs, ctx) => {
      const { id } = sanitize(rawArgs);

      try {
        const [deletedUser] = await ctx.db
          .delete(users)
          .where(eq(users.id, String(id)))
          .returning();

        if (!deletedUser) {
          throw new Error("El usuario que intenta eliminar no existe");
        }

        return deletedUser;
      } catch (error) {
        handleDbError(error, {
          notFound: "El usuario que intenta eliminar no existe",
          foreignKey:
            "No se puede eliminar el usuario porque tiene datos relacionados",
        });
      }
    },
  }),
);
