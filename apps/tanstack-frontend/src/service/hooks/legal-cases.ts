import { useQuery } from "@tanstack/react-query";
import type {
  LegalCaseQueryVariables,
  RecentLegalCasesQueryVariables,
} from "#/service/gql/generated/gql";
import { service } from "#/service/service.client";

export function useRecentLegalCases(
  variables?: RecentLegalCasesQueryVariables,
) {
  return useQuery({
    queryKey: ["recentLegalCases", variables],
    queryFn: () => service.gql.RecentLegalCases(variables),
  });
}

export function useLegalCase(variables: LegalCaseQueryVariables) {
  return useQuery({
    queryKey: ["legalCase", variables],
    queryFn: () => service.gql.LegalCase(variables),
    enabled: !!variables.slug,
  });
}
