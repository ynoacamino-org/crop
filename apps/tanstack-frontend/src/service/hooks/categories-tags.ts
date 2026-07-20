import { useQuery } from "@tanstack/react-query";
import type {
  CategoriesQueryVariables,
  TagsQueryVariables,
} from "#/service/gql/generated/gql";
import { service } from "#/service/service.client";

export function useCategories(variables?: CategoriesQueryVariables) {
  return useQuery({
    queryKey: ["categories", variables],
    queryFn: () => service.gql.Categories(variables),
  });
}

export function useTags(variables?: TagsQueryVariables) {
  return useQuery({
    queryKey: ["tags", variables],
    queryFn: () => service.gql.Tags(variables),
  });
}
