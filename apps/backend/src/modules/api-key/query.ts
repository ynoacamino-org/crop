import { eq } from "drizzle-orm";
import { UnauthorizedError } from "@/core/errors/gql";
import { apikeys } from "@/domain/db/schema";
import { ApiKey } from "@/modules/api-key/model";
import { builder } from "@/shared/graphql/builder";

builder.queryField("apiKeys", (t) =>
  t.field({
    type: [ApiKey],
    authScopes: { authenticated: true },
    resolve: async (_root, _args, ctx) => {
      if (!ctx.user) throw new UnauthorizedError();

      const userKeys = await ctx.db
        .select()
        .from(apikeys)
        .where(eq(apikeys.referenceId, ctx.user.id));

      return userKeys.map((key) => ({
        id: key.id,
        name: key.name,
        prefix: key.prefix,
        expiresAt: key.expiresAt,
        createdAt: key.createdAt,
      }));
    },
  }),
);
