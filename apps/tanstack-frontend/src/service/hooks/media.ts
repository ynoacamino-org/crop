import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "#/lib/graphql-client";
import type {
  CreateMediaMutationVariables,
  DeleteMediaMutationVariables,
  MediaQueryVariables,
  MediasQueryVariables,
  UpdateMediaMutationVariables,
} from "#/service/gql/generated/gql";

export function useMedias(variables?: MediasQueryVariables) {
  return useQuery({
    queryKey: ["medias", variables],
    queryFn: () => sdk.Medias(variables),
  });
}

export function useMedia(variables: MediaQueryVariables) {
  return useQuery({
    queryKey: ["media", variables],
    queryFn: () => sdk.Media(variables),
    enabled: !!variables.id,
  });
}

export function useCreateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: CreateMediaMutationVariables) =>
      sdk.CreateMedia(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateMediaMutationVariables) =>
      sdk.UpdateMedia(variables),
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
      sdk.DeleteMedia(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
}
