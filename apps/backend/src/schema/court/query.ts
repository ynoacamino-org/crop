import { and, asc, eq, ilike } from "drizzle-orm";
import { builder } from "@/builder";
import { courts } from "@/db/schema";
import { db } from "@/lib/db";
import { handleDbError } from "@/lib/errors/db";
import { NotFoundError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";

builder.queryField("courts", (t) =>
  t.field({
    type: ["Court"],
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of courts to take",
        defaultValue: 10,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of courts to skip",
        defaultValue: 0,
      }),
      type: t.arg.string({
        required: false,
        description: "Filter by court type",
      }),
      jurisdiction: t.arg.string({
        required: false,
        description: "Filter by jurisdiction",
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for court name",
      }),
    },
    resolve: async (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        const filters = [
          args.type
            ? eq(
                courts.type,
                args.type as Exclude<typeof courts.$inferSelect.type, null>,
              )
            : undefined,
          args.jurisdiction
            ? eq(
                courts.jurisdiction,
                args.jurisdiction as Exclude<
                  typeof courts.$inferSelect.jurisdiction,
                  null
                >,
              )
            : undefined,
          args.search ? ilike(courts.name, `%${args.search}%`) : undefined,
        ].filter((condition): condition is NonNullable<typeof condition> =>
          Boolean(condition),
        );

        return await db
          .select()
          .from(courts)
          .where(filters.length ? and(...filters) : undefined)
          .orderBy(asc(courts.name))
          .limit(args.take ?? 10)
          .offset(args.skip ?? 0);
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);

builder.queryField("court", (t) =>
  t.field({
    type: "Court",
    args: {
      id: t.arg.string({
        required: true,
        description: "Court ID",
      }),
    },
    resolve: async (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        const [court] = await db
          .select()
          .from(courts)
          .where(eq(courts.id, args.id))
          .limit(1);

        if (!court) {
          throw new NotFoundError("Corte no encontrada");
        }

        return court;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
