"use client";

import { useSearchParams } from "next/navigation";
import { REST_QUERY_PARAMS_CONFIG } from "@/service/core/types/search-params-config";

export interface QueryParams {
  limit?: number;
  offset?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: string | number | undefined;
}

export function useQueryParams(): QueryParams {
  const searchParams = useSearchParams();

  const limit = searchParams.get(REST_QUERY_PARAMS_CONFIG.limit);
  const offset = searchParams.get(REST_QUERY_PARAMS_CONFIG.offset);
  const search = searchParams.get(REST_QUERY_PARAMS_CONFIG.search);
  const sort = searchParams.get(REST_QUERY_PARAMS_CONFIG.sort);
  const order = searchParams.get(REST_QUERY_PARAMS_CONFIG.order);

  return {
    limit: limit ? Number(limit) : undefined,
    offset: offset ? Number(offset) : undefined,
    search: search || undefined,
    sort: sort || undefined,
    order: (order as "asc" | "desc") || undefined,
  };
}
