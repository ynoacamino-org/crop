export type FilterOperator =
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

export type SortInput = { field: string; direction: "ASC" | "DESC" };

export type DrizzleOrderBy = Record<string, "asc" | "desc">;
