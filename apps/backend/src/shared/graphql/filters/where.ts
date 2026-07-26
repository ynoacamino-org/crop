import type { FilterOperator } from "@/shared/graphql/filters/types";

type DrizzleWhere = Record<string, FilterOperator> & {
  OR?: DrizzleWhere[];
  AND?: DrizzleWhere[];
  NOT?: DrizzleWhere;
};

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

function buildFieldFilter(
  filterValue: Record<string, unknown>,
  isEnum: boolean,
): FilterOperator | undefined {
  const operators = Object.keys(filterValue);
  if (operators.length === 0) return undefined;

  if (isEnum) {
    return resolveOperator("eq", filterValue.eq);
  }

  for (const op of operators) {
    const val = filterValue[op];
    if (val !== undefined && val !== null) {
      return resolveOperator(op, val);
    }
  }

  return undefined;
}

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
