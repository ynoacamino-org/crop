import { ilike, or } from "drizzle-orm";
import { legalCases } from "@/domain/db/schema";
import { builder } from "@/infrastructure/graphql/builder";
import {
  createDbCountPageInfoResolver,
  PaginationInfo,
} from "@/infrastructure/graphql/schema/pagination/model";
import { handleDbError } from "@/infrastructure/lib/errors/db";
import { NotFoundError } from "@/infrastructure/lib/errors/gql";
import { sanitize } from "@/infrastructure/lib/utils/sanitize";

interface LegalCasesConnectionShape {
  take: number;
  skip: number;
  search?: string;
}

const LegalCasesConnection = builder.objectRef<LegalCasesConnectionShape>(
  "LegalCasesConnection",
);

LegalCasesConnection.implement({
  description: "Paginated list of legal cases",
  fields: (t) => ({
    items: t.drizzleField({
      type: ["legalCases"],
      resolve: async (query, parent, _args, ctx) => {
        const searchTerm = parent.search ? `%${parent.search}%` : undefined;

        try {
          return await ctx.db.query.legalCases.findMany(
            query({
              where: searchTerm
                ? {
                    OR: [
                      { caseName: { ilike: searchTerm } },
                      { caseNumber: { ilike: searchTerm } },
                      { parties: { ilike: searchTerm } },
                    ],
                  }
                : undefined,
              orderBy: {
                caseDate: "desc",
              },
              limit: parent.take,
              offset: parent.skip,
            }),
          );
        } catch (error) {
          handleDbError(error);
        }
      },
    }),
    pageInfo: t.field({
      type: PaginationInfo,
      resolve: createDbCountPageInfoResolver<LegalCasesConnectionShape>({
        source: legalCases,
        where: (parent) => {
          const searchTerm = parent.search ? `%${parent.search}%` : undefined;

          return searchTerm
            ? or(
                ilike(legalCases.caseName, searchTerm),
                ilike(legalCases.caseNumber, searchTerm),
                ilike(legalCases.parties, searchTerm),
              )
            : undefined;
        },
        onError: handleDbError,
      }),
    }),
  }),
});

builder.queryField("legalCases", (t) =>
  t.field({
    type: LegalCasesConnection,
    args: {
      take: t.arg.int({
        required: false,
        description: "Number of cases to take",
        defaultValue: 10,
      }),
      skip: t.arg.int({
        required: false,
        description: "Number of cases to skip",
        defaultValue: 0,
      }),
      search: t.arg.string({
        required: false,
        description: "Search term for case name, case number, or parties",
      }),
    },
    resolve: (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      return {
        take: args.take ?? 10,
        skip: args.skip ?? 0,
        search: args.search?.trim() || undefined,
      };
    },
  }),
);

builder.queryField("legalCase", (t) =>
  t.drizzleField({
    type: "legalCases",
    args: {
      id: t.arg.string({
        required: false,
        description: "Legal case ID",
      }),
      slug: t.arg.string({
        required: false,
        description: "Legal case slug",
      }),
      caseNumber: t.arg.string({
        required: false,
        description: "Legal case number",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      const args = sanitize(rawArgs);

      if (!args.id && !args.slug && !args.caseNumber) {
        throw new NotFoundError("Se debe proporcionar id, slug o caseNumber");
      }

      try {
        const legalCase = await ctx.db.query.legalCases.findFirst(
          query({
            where: args.id
              ? { id: args.id }
              : args.slug
                ? { slug: args.slug }
                : { caseNumber: args.caseNumber as string },
          }),
        );

        if (!legalCase) {
          throw new NotFoundError("Caso legal no encontrado");
        }

        return legalCase;
      } catch (error) {
        handleDbError(error);
      }
    },
  }),
);
