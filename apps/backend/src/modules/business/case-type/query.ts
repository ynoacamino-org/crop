import { caseTypes } from "@/domain/db/schema";
import {
  CASE_TYPE_ENUM_FIELDS,
  CASE_TYPE_SORT_FIELD_MAP,
  CaseTypeFilter,
  CaseTypeSort,
} from "@/modules/business/case-type/inputs";
import { builder } from "@/shared/graphql/builder";
import { createConnectionType } from "@/shared/graphql/connection";

const CASE_TYPE_COLUMNS = {
  name: caseTypes.name,
  slug: caseTypes.slug,
  description: caseTypes.description,
  color: caseTypes.color,
  icon: caseTypes.icon,
  order: caseTypes.order,
  active: caseTypes.active,
};

const { listQuery } = createConnectionType({
  typeName: "CaseTypesConnection",
  description: "Paginated list of case types",
  table: caseTypes,
  itemType: "caseTypes",
  filterInput: CaseTypeFilter,
  sortInput: CaseTypeSort,
  enumFields: CASE_TYPE_ENUM_FIELDS,
  fieldMap: CASE_TYPE_SORT_FIELD_MAP,
  columns: CASE_TYPE_COLUMNS,
  defaultTake: 50,
});

listQuery("caseTypes", "Get all case types with pagination");

builder.queryField("caseType", (t) =>
  t.drizzleField({
    type: "caseTypes",
    nullable: true,
    description: "Get a single case type by ID or slug",
    args: {
      id: t.arg.string({ required: false }),
      slug: t.arg.string({ required: false }),
    },
    resolve: async (query, _root, args, ctx) => {
      if (!args.id && !args.slug) {
        return null;
      }

      return await ctx.db.query.caseTypes.findFirst(
        query({
          where: args.id
            ? { id: args.id }
            : {
                slug: args.slug as string,
              },
        }),
      );
    },
  }),
);
