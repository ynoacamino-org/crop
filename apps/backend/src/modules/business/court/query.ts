import { handleDbError } from "@/core/errors/db";
import { NotFoundError } from "@/core/errors/gql";
import { sanitize } from "@/core/utils/sanitize";
import { courts } from "@/domain/db/schema";
import {
  COURT_ENUM_FIELDS,
  COURT_SORT_FIELD_MAP,
  CourtFilter,
  CourtSort,
} from "@/modules/business/court/inputs";
import { builder } from "@/shared/graphql/builder";
import { createConnectionType } from "@/shared/graphql/connection";

const COURT_COLUMNS = {
  name: courts.name,
  type: courts.type,
  jurisdiction: courts.jurisdiction,
  description: courts.description,
};

const { listQuery } = createConnectionType({
  typeName: "CourtsConnection",
  description: "Paginated list of courts",
  table: courts,
  itemType: "courts",
  filterInput: CourtFilter,
  sortInput: CourtSort,
  enumFields: COURT_ENUM_FIELDS,
  fieldMap: COURT_SORT_FIELD_MAP,
  columns: COURT_COLUMNS,
});

listQuery("courts", "Get all courts with pagination");

builder.queryField("court", (t) =>
  t.drizzleField({
    type: "courts",
    nullable: true,
    description: "Get a single court by ID",
    args: {
      id: t.arg.string({
        required: true,
        description: "Court ID",
      }),
    },
    resolve: async (query, _root, rawArgs, ctx) => {
      const args = sanitize(rawArgs);

      try {
        const court = await ctx.db.query.courts.findFirst(
          query({
            where: {
              id: args.id,
            },
          }),
        );

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
