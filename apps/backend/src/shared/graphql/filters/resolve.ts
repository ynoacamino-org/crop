import {
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
  or,
} from "drizzle-orm";

type FilterOperator =
  | { eq: unknown }
  | { ne: unknown }
  | { gt: unknown }
  | { gte: unknown }
  | { lt: unknown }
  | { lte: unknown }
  | { in: unknown[] }
  | { notIn: unknown[] }
  | { like: string }
  | { ilike: string }
  | { notLike: string }
  | { notIlike: string }
  | { isNull: true }
  | { isNotNull: true };

type DrizzleWhere = Record<string, FilterOperator> & {
  OR?: DrizzleWhere[];
  AND?: DrizzleWhere[];
  NOT?: DrizzleWhere;
};

type SortInput = { field: string; direction: "ASC" | "DESC" };

type DrizzleOrderBy = Record<string, "asc" | "desc">;

type SqlCondition = ReturnType<typeof eq> | ReturnType<typeof or> | undefined;

/**
 * Maps GraphQL filter operators to Drizzle relational query operators.
 * Handles string-specific operators (contains, startsWith, endsWith) by
 * converting them to LIKE patterns.
 */
function resolveOperator(
  operator: string,
  value: unknown,
): FilterOperator | undefined {
  switch (operator) {
    case "eq":
      return { eq: value };
    case "not":
      return { ne: value };
    case "gt":
      return { gt: value };
    case "gte":
      return { gte: value };
    case "lt":
      return { lt: value };
    case "lte":
      return { lte: value };
    case "in":
      return { in: value as unknown[] };
    case "contains":
      return { like: `%${value}%` };
    case "startsWith":
      return { like: `${value}%` };
    case "endsWith":
      return { like: `%${value}` };
    default:
      return undefined;
  }
}

/**
 * Converts a single filter field to a Drizzle where clause.
 * For enum fields, uses eq directly. For string fields with
 * contains/startsWith/endsWith, converts to LIKE patterns.
 */
function buildFieldFilter(
  filterValue: Record<string, unknown>,
  isEnum: boolean,
): FilterOperator | undefined {
  const operators = Object.keys(filterValue);
  if (operators.length === 0) return undefined;

  // For enums, only eq is meaningful
  if (isEnum) {
    return resolveOperator("eq", filterValue.eq);
  }

  // For other types, find the first defined operator
  for (const op of operators) {
    const val = filterValue[op];
    if (val !== undefined && val !== null) {
      return resolveOperator(op, val);
    }
  }

  return undefined;
}

/**
 * Converts a GraphQL filter input to a Drizzle relational query where clause.
 *
 * @param filter - The GraphQL filter input object
 * @param enumFields - Set of field names that are enums (only eq is used)
 * @returns Drizzle where clause object
 *
 * @example
 * ```ts
 * const where = buildDrizzleWhere(
 *   { title: { contains: "constitucional" }, status: { eq: "PUBLISHED" } },
 *   new Set(["status"])
 * );
 * // Returns: { title: { like: "%constitucional%" }, status: { eq: "PUBLISHED" } }
 * ```
 */
export function buildDrizzleWhere(
  filter: Record<string, Record<string, unknown>> | null | undefined,
  enumFields: Set<string> = new Set(),
): DrizzleWhere | undefined {
  if (!filter) return undefined;

  const where: DrizzleWhere = {};

  for (const [field, filterValue] of Object.entries(filter)) {
    if (!filterValue || typeof filterValue !== "object") continue;

    const isEnum = enumFields.has(field);
    const operator = buildFieldFilter(
      filterValue as Record<string, unknown>,
      isEnum,
    );

    if (operator) {
      where[field] = operator;
    }
  }

  return Object.keys(where).length > 0 ? where : undefined;
}

/**
 * Converts a GraphQL filter input to Drizzle SQL conditions using drizzle-orm operators.
 * Used for $count() and other SQL-level operations that need actual SQL conditions.
 *
 * @param filter - The GraphQL filter input object
 * @param columns - Map of field names to Drizzle column objects
 * @param enumFields - Set of field names that are enums
 * @returns SQL condition for use with drizzle-orm
 *
 * @example
 * ```ts
 * const condition = buildDrizzleSqlWhere(
 *   { title: { contains: "constitucional" }, status: { eq: "PUBLISHED" } },
 *   { title: articles.title, status: articles.status },
 *   new Set(["status"])
 * );
 * // Returns: or(ilike(articles.title, "%constitucional%"), eq(articles.status, "PUBLISHED"))
 * ```
 */
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

    // For enums, only eq is meaningful
    if (isEnum && ops.eq !== undefined) {
      conditions.push(eq(column, ops.eq as string));
      continue;
    }

    // Handle each operator
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
        // Skip other operators
      }
      break; // Only handle the first defined operator per field
    }
  }

  if (conditions.length === 0) return undefined;
  if (conditions.length === 1) return conditions[0];
  return or(...conditions);
}

/**
 * Converts a GraphQL sort input array to a Drizzle orderBy clause.
 *
 * @param sort - Array of { field, direction } objects
 * @param fieldMap - Maps GraphQL enum values to Drizzle column names (e.g., { PUBLISHED_AT: "publishedAt" })
 * @returns Drizzle orderBy clause
 *
 * @example
 * ```ts
 * const orderBy = buildDrizzleOrderBy(
 *   [{ field: "PUBLISHED_AT", direction: "DESC" }, { field: "TITLE", direction: "ASC" }],
 *   { PUBLISHED_AT: "publishedAt", TITLE: "title" }
 * );
 * // Returns: [{ publishedAt: "desc" }, { title: "asc" }]
 * ```
 */
export function buildDrizzleOrderBy(
  sort: SortInput[] | null | undefined,
  fieldMap: Record<string, string>,
): DrizzleOrderBy | undefined {
  if (!sort || sort.length === 0) return undefined;

  // Drizzle relational query orderBy only accepts a single object
  // Use the first sort field
  const firstSort = sort[0];
  if (!firstSort) return undefined;

  const columnName = fieldMap[firstSort.field];
  if (!columnName) return undefined;

  return { [columnName]: firstSort.direction.toLowerCase() as "asc" | "desc" };
}
