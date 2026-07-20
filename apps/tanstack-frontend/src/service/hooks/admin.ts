import { useQuery } from "@tanstack/react-query";
import type { AdminStatsQueryVariables } from "#/service/gql/generated/gql";
import { service } from "#/service/service.client";

export function useAdminStats(variables?: AdminStatsQueryVariables) {
  return useQuery({
    queryKey: ["adminStats", variables],
    queryFn: () => service.gql.AdminStats(variables),
  });
}
