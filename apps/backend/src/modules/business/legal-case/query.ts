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
import { createConnectionType } from "@/shared/graphql/connection";

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

const { listQuery } = createConnectionType({
  typeName: "LegalCasesConnection",
  description: "Paginated list of legal cases",
  table: legalCases,
  itemType: "legalCases",
  filterInput: LegalCaseFilter,
  sortInput: LegalCaseSort,
  enumFields: LEGAL_CASE_ENUM_FIELDS,
  fieldMap: LEGAL_CASE_SORT_FIELD_MAP,
  columns: LEGAL_CASE_COLUMNS,
});

listQuery("legalCases", "Get all legal cases with pagination");

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
