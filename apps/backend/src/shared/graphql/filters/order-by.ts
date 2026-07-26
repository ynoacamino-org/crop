import type { DrizzleOrderBy, SortInput } from "@/shared/graphql/filters/types";

export function buildDrizzleOrderBy(
  sort: SortInput[] | null | undefined,
  fieldMap: Record<string, string>,
): DrizzleOrderBy | undefined {
  if (!sort || sort.length === 0) return undefined;

  const firstSort = sort[0];
  if (!firstSort) return undefined;

  const columnName = fieldMap[firstSort.field];
  if (!columnName) return undefined;

  return { [columnName]: firstSort.direction.toLowerCase() as "asc" | "desc" };
}
