import type { CourtType, Jurisdiction } from "@prisma/client/client";
import { handlePrismaError } from "@prisma/lib/error-handler";
import { builder } from "@/builder";
import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/errors/gql";
import { sanitize } from "@/lib/utils/sanitize";

builder.queryField("courts", (t) =>
  t.prismaField({
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
    resolve: async (query, _root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        return await db.court.findMany({
          ...query,
          take: args.take,
          skip: args.skip,
          where: {
            ...(args.type && {
              type: args.type as CourtType,
            }),
            ...(args.jurisdiction && {
              jurisdiction: args.jurisdiction as Jurisdiction,
            }),
            ...(args.search && {
              name: { contains: args.search, mode: "insensitive" },
            }),
          },
          orderBy: {
            name: "asc",
          },
        });
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);

builder.queryField("court", (t) =>
  t.prismaField({
    type: "Court",
    args: {
      id: t.arg.string({
        required: true,
        description: "Court ID",
      }),
    },
    resolve: async (query, _root, rawArgs) => {
      const args = sanitize(rawArgs);

      try {
        const court = await db.court.findUnique({
          ...query,
          where: { id: args.id },
        });

        if (!court) {
          throw new NotFoundError("Corte no encontrada");
        }

        return court;
      } catch (error) {
        handlePrismaError(error);
      }
    },
  }),
);
