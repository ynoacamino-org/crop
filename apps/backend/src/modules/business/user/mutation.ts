import {
  DeleteUserPayloadSchema,
  UpdateUserPayloadSchema,
} from "@repo/schemas/user";
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
  t.drizzleField({
    type: "users",
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
        await ctx.db
          .update(users)
          .set({
            ...(input.name !== undefined && { name: input.name }),
            ...(input.image !== undefined && { image: input.image }),
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.user.id));

        const updatedUser = await ctx.db.query.users.findFirst(
          query({ where: { id: ctx.user.id } }),
        );

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
  t.drizzleField({
    type: "users",
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
    resolve: async (query, _root, rawArgs, ctx) => {
      const { id, input } = sanitize(rawArgs);

      try {
        await ctx.db
          .update(users)
          .set({
            ...(input.name !== undefined && { name: input.name }),
            ...(input.image !== undefined && { image: input.image }),
            ...(input.role !== undefined && {
              role: input.role as "PUBLIC" | "COLLABORATOR" | "ADMIN",
            }),
            updatedAt: new Date(),
          })
          .where(eq(users.id, String(id)));

        const updatedUser = await ctx.db.query.users.findFirst(
          query({ where: { id: String(id) } }),
        );

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
  t.drizzleField({
    type: "users",
    authScopes: {
      public: true,
    },
    resolve: async (query, _root, _args, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      try {
        const fullUser = await ctx.db.query.users.findFirst(
          query({ where: { id: ctx.user.id } }),
        );

        if (!fullUser) {
          throw new Error("Usuario no encontrado");
        }

        await ctx.db.delete(users).where(eq(users.id, ctx.user.id));

        return fullUser;
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
  t.drizzleField({
    type: "users",
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
    resolve: async (query, _root, rawArgs, ctx) => {
      const { id } = sanitize(rawArgs);

      try {
        const fullUser = await ctx.db.query.users.findFirst(
          query({ where: { id: String(id) } }),
        );

        if (!fullUser) {
          throw new Error("El usuario que intenta eliminar no existe");
        }

        await ctx.db.delete(users).where(eq(users.id, String(id)));

        return fullUser;
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
