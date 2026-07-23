export const REST_QUERY_PARAMS_CONFIG = {
  limit: "limit",
  offset: "offset",
  search: "search",
  sort: "sort",
  order: "order",
  filter: "filter",
} as const;

export type RestQueryParamKey =
  (typeof REST_QUERY_PARAMS_CONFIG)[keyof typeof REST_QUERY_PARAMS_CONFIG];
