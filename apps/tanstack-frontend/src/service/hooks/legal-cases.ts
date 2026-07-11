import { useQuery } from "@tanstack/react-query";
import { sdk } from "#/lib/graphql-client";
import type {
  LegalCaseQueryVariables,
  RecentLegalCasesQueryVariables,
} from "#/service/gql/generated/gql";

export function useRecentLegalCases(
  variables?: RecentLegalCasesQueryVariables,
) {
  return useQuery({
    queryKey: ["recentLegalCases", variables],
    queryFn: () => sdk.RecentLegalCases(variables),
  });
}

export function useLegalCase(variables: LegalCaseQueryVariables) {
  return useQuery({
    queryKey: ["legalCase", variables],
    queryFn: () => sdk.LegalCase(variables),
    enabled: !!variables.slug,
  });
}
