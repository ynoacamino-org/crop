import { idSchema } from "@repo/schemas/common";
import { and, eq } from "drizzle-orm";
import { UnauthorizedError } from "@/core/errors/gql";
import { apikeys } from "@/domain/db/schema";
import { CreateApiKeyInput } from "@/modules/api-key/inputs";
import { ApiKey } from "@/modules/api-key/model";
import { builder } from "@/shared/graphql/builder";

builder.mutationField("createApiKey", (t) =>
  t.field({
    type: ApiKey,
    authScopes: { authenticated: true },
    args: {
      input: t.arg({ type: CreateApiKeyInput, required: true }),
    },
    resolve: async (_root, _args, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const expiresInSeconds = _args.input.expiresIn
        ? _args.input.expiresIn * 86400
        : undefined;

      const result = await ctx.runtime.auth.api.createApiKey({
        body: {
          name: _args.input.name,
          userId: ctx.user.id,
          expiresIn: expiresInSeconds,
        },
      });

      return {
        id: result.id,
        name: result.name,
        prefix: result.prefix,
        key: result.key,
        expiresAt: result.expiresAt,
        createdAt: result.createdAt,
      };
    },
  }),
);

builder.mutationField("deleteApiKey", (t) =>
  t.field({
    type: "Boolean",
    authScopes: { authenticated: true },
    args: {
      id: t.arg.string({ required: true, validate: idSchema }),
    },
    resolve: async (_root, _args, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      await ctx.db
        .delete(apikeys)
        .where(
          and(eq(apikeys.id, _args.id), eq(apikeys.referenceId, ctx.user.id)),
        );

      return true;
    },
  }),
);
