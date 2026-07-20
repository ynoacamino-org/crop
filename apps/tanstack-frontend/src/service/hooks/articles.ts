import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { service } from "#/service/service.client";

export function useRecentArticles(variables?: RecentArticlesQueryVariables) {
  return useQuery({
    queryKey: ["recentArticles", variables],
    queryFn: () => service.gql.RecentArticles(variables),
  });
}

export function useArticle(variables: ArticleQueryVariables) {
  return useQuery({
    queryKey: ["article", variables],
    queryFn: () => service.gql.Article(variables),
    enabled: !!variables.slug,
  });
}

export function useArticleById(variables: ArticleByIdQueryVariables) {
  return useQuery({
    queryKey: ["articleById", variables],
    queryFn: () => service.gql.ArticleById(variables),
    enabled: !!variables.id,
  });
}

export function useAdminArticles(variables?: AdminArticlesQueryVariables) {
  return useQuery({
    queryKey: ["adminArticles", variables],
    queryFn: () => service.gql.AdminArticles(variables),
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: CreateArticleMutationVariables) =>
      service.gql.CreateArticle(variables),
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
      service.gql.UpdateArticle(variables),
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
      service.gql.UpdateArticleStatus(variables),
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
      service.gql.DeleteArticle(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recentArticles"] });
      queryClient.invalidateQueries({ queryKey: ["adminArticles"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
  });
}
