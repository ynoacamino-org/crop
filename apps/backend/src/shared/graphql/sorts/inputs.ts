import { builder } from "@/shared/graphql/builder";

export const SortDirection = builder.enumType("SortDirection", {
  description: "Sort direction for ordering results",
  values: ["ASC", "DESC"] as const,
});
