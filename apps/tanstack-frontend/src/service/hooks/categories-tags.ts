import { useQuery } from "@tanstack/react-query";
import { sdk } from "#/lib/graphql-client";
import type {
  CategoriesQueryVariables,
  TagsQueryVariables,
} from "#/service/gql/generated/gql";

export function useCategories(variables?: CategoriesQueryVariables) {
  return useQuery({
    queryKey: ["categories", variables],
    queryFn: () => sdk.Categories(variables),
  });
}

export function useTags(variables?: TagsQueryVariables) {
  return useQuery({
    queryKey: ["tags", variables],
    queryFn: () => sdk.Tags(variables),
  });
}
