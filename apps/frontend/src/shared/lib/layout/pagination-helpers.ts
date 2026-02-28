import type { QueryParams } from "../hooks/useQueryParams";

export interface PaginationInfo {
  currentPage: number;
  pageLimit: number;
  totalPages: number;
  offset: number;
  skip: number;
  take: number;
}

export function getPaginationInfo(
  queryParams: QueryParams,
  totalItems: number,
  defaultLimit = 12,
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
