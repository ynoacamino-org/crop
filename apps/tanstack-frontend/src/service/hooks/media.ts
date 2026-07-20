import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateMediaMutationVariables,
  DeleteMediaMutationVariables,
  MediaQueryVariables,
  MediasQueryVariables,
  UpdateMediaMutationVariables,
} from "#/service/gql/generated/gql";
import { service } from "#/service/service.client";

export function useMedias(variables?: MediasQueryVariables) {
  return useQuery({
    queryKey: ["medias", variables],
    queryFn: () => service.gql.Medias(variables),
  });
}

export function useMedia(variables: MediaQueryVariables) {
  return useQuery({
    queryKey: ["media", variables],
    queryFn: () => service.gql.Media(variables),
    enabled: !!variables.id,
  });
}

export function useCreateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: CreateMediaMutationVariables) =>
      service.gql.CreateMedia(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateMediaMutationVariables) =>
      service.gql.UpdateMedia(variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
      queryClient.invalidateQueries({
        queryKey: ["media", { id: variables.id }],
      });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: DeleteMediaMutationVariables) =>
      service.gql.DeleteMedia(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
}
