import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "#/lib/graphql-client";
import type {
  AdminArticlesQueryVariables,
  ArticleByIdQueryVariables,
  ArticleQueryVariables,
  CreateArticleMutationVariables,
  DeleteArticleMutationVariables,
  RecentArticlesQueryVariables,
  UpdateArticleMutationVariables,
  UpdateArticleStatusMutationVariables,
} from "#/service/gql/generated/gql";

export function useRecentArticles(variables?: RecentArticlesQueryVariables) {
  return useQuery({
    queryKey: ["recentArticles", variables],
    queryFn: () => sdk.RecentArticles(variables),
  });
}

export function useArticle(variables: ArticleQueryVariables) {
  return useQuery({
    queryKey: ["article", variables],
    queryFn: () => sdk.Article(variables),
    enabled: !!variables.slug,
  });
}

export function useArticleById(variables: ArticleByIdQueryVariables) {
  return useQuery({
    queryKey: ["articleById", variables],
    queryFn: () => sdk.ArticleById(variables),
    enabled: !!variables.id,
  });
}

export function useAdminArticles(variables?: AdminArticlesQueryVariables) {
  return useQuery({
    queryKey: ["adminArticles", variables],
    queryFn: () => sdk.AdminArticles(variables),
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: CreateArticleMutationVariables) =>
      sdk.CreateArticle(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentArticles"] });
      queryClient.invalidateQueries({ queryKey: ["adminArticles"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateArticleMutationVariables) =>
      sdk.UpdateArticle(variables),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recentArticles"] });
      queryClient.invalidateQueries({ queryKey: ["adminArticles"] });
      if (data?.updateArticle?.slug) {
        queryClient.invalidateQueries({
          queryKey: ["article", { slug: data.updateArticle.slug }],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["articleById", { id: variables.id }],
      });
    },
  });
}

export function useUpdateArticleStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateArticleStatusMutationVariables) =>
      sdk.UpdateArticleStatus(variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recentArticles"] });
      queryClient.invalidateQueries({ queryKey: ["adminArticles"] });
      queryClient.invalidateQueries({
        queryKey: ["articleById", { id: variables.id }],
      });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: DeleteArticleMutationVariables) =>
      sdk.DeleteArticle(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentArticles"] });
      queryClient.invalidateQueries({ queryKey: ["adminArticles"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}
