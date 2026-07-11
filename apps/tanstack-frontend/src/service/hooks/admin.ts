import { useQuery } from "@tanstack/react-query";
import { sdk } from "#/lib/graphql-client";
import type { AdminStatsQueryVariables } from "#/service/gql/generated/gql";

export function useAdminStats(variables?: AdminStatsQueryVariables) {
  return useQuery({
    queryKey: ["adminStats", variables],
    queryFn: () => sdk.AdminStats(variables),
  });
}
