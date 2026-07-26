import { handleDbError } from "@/core/errors/db";
import { NotFoundError } from "@/core/errors/gql";
import { sanitize } from "@/core/utils/sanitize";
import { legalCases } from "@/domain/db/schema";
import {
  LEGAL_CASE_ENUM_FIELDS,
  LEGAL_CASE_SORT_FIELD_MAP,
  LegalCaseFilter,
  LegalCaseSort,
} from "@/modules/business/legal-case/inputs";
import { builder } from "@/shared/graphql/builder";
import {
  buildDrizzleOrderBy,
  buildDrizzleSqlWhere,
  buildDrizzleWhere,
} from "@/shared/graphql/filters";
import {
  createDbCountPageInfoResolver,
  PaginationInfo,
} from "@/shared/pagination/model";

const LEGAL_CASE_COLUMNS = {
  caseNumber: legalCases.caseNumber,
  caseName: legalCases.caseName,
  summary: legalCases.summary,
  parties: legalCases.parties,
  plaintiff: legalCases.plaintiff,
  defendant: legalCases.defendant,
  jurisdiction: legalCases.jurisdiction,
  caseTypeId: legalCases.caseTypeId,
  courtId: legalCases.courtId,
  caseDate: legalCases.caseDate,
  resolutionDate: legalCases.resolutionDate,
};

interface LegalCasesConnectionShape {
  take: number;
  skip: number;
  filter?: Record<string, Record<string, unknown>>;
  sort?: { field: string; direction: "ASC" | "DESC" }[];
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
        try {
          return await ctx.db.query.legalCases.findMany(
            query({
              where: buildDrizzleWhere(parent.filter, LEGAL_CASE_ENUM_FIELDS),
              orderBy: buildDrizzleOrderBy(
                parent.sort,
                LEGAL_CASE_SORT_FIELD_MAP,
              ),
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
        where: (parent) =>
          buildDrizzleSqlWhere(
            parent.filter,
            LEGAL_CASE_COLUMNS,
            LEGAL_CASE_ENUM_FIELDS,
          ),
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
      filter: t.arg({
        type: LegalCaseFilter,
        required: false,
        description: "Filter legal cases by fields",
      }),
      sort: t.arg({
        type: [LegalCaseSort],
        required: false,
        description: "Sort legal cases by fields",
      }),
    },
    resolve: (_root, rawArgs) => {
      const args = sanitize(rawArgs);

      return {
        take: args.take ?? 10,
        skip: args.skip ?? 0,
        filter: args.filter ?? undefined,
        sort: args.sort ?? undefined,
      };
    },
  }),
);

builder.queryField("legalCase", (t) =>
  t.drizzleField({
    type: "legalCases",
    nullable: true,
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
