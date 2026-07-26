import {
  and,
  type Column,
  eq,
  gt,
  gte,
  inArray,
  like,
  lt,
  lte,
  ne,
  notInArray,
  type SQL,
} from "drizzle-orm";

type SqlCondition = SQL | undefined;

export function buildDrizzleSqlWhere(
  filter: Record<string, Record<string, unknown>> | null | undefined,
  columns: Record<string, Column>,
  enumFields: Set<string> = new Set(),
): SqlCondition {
  if (!filter) return undefined;

  const conditions: SqlCondition[] = [];

  for (const [field, filterValue] of Object.entries(filter)) {
    if (!filterValue || typeof filterValue !== "object") continue;

    const column = columns[field];
    if (!column) continue;

    const isEnum = enumFields.has(field);
    const ops = filterValue as Record<string, unknown>;

    if (isEnum && ops.eq !== undefined) {
      conditions.push(eq(column, ops.eq as string));
      continue;
    }

    for (const [op, value] of Object.entries(ops)) {
      if (value === undefined || value === null) continue;

      switch (op) {
        case "eq":
          conditions.push(eq(column, value as string));
          break;
        case "not":
          conditions.push(ne(column, value as string));
          break;
        case "gt":
          conditions.push(gt(column, value as number));
          break;
        case "gte":
          conditions.push(gte(column, value as number));
          break;
        case "lt":
          conditions.push(lt(column, value as number));
          break;
        case "lte":
          conditions.push(lte(column, value as number));
          break;
        case "in":
          conditions.push(inArray(column, value as string[]));
          break;
        case "notIn":
          conditions.push(notInArray(column, value as string[]));
          break;
        case "contains":
          conditions.push(like(column, `%${value}%`));
          break;
        case "startsWith":
          conditions.push(like(column, `${value}%`));
          break;
        case "endsWith":
          conditions.push(like(column, `%${value}`));
          break;
      }
      break;
    }
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return and(...conditions);
}
