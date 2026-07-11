const DEFAULT_LIMIT = 12;

export interface PaginationInfo {
  currentPage: number;
  pageLimit: number;
  totalPages: number;
  offset: number;
  skip: number;
  take: number;
}

export interface QueryParams {
  limit?: number;
  offset?: number;
  [key: string]: string | number | undefined;
}

export async function parsePaginationParams(
  searchParams: Promise<{ limit?: string; offset?: string }>,
) {
  const params = await searchParams;
  const limit = Number(params.limit) || DEFAULT_LIMIT;
  const offset = Number(params.offset) || 0;

  return { limit, offset };
}

export function getPaginationInfo(
  queryParams: QueryParams,
  totalItems: number,
  defaultLimit = DEFAULT_LIMIT,
): PaginationInfo {
  const pageLimit = queryParams.limit || defaultLimit;
  const offset = queryParams.offset || 0;

  const currentPage = Math.floor(offset / pageLimit) + 1;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageLimit));
  const skip = offset;
  const take = pageLimit;

  return {
    currentPage,
    pageLimit,
    totalPages,
    offset,
    skip,
    take,
  };
}
