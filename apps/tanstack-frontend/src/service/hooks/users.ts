import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "#/lib/graphql-client";
import type {
  DeleteMeMutationVariables,
  DeleteUserMutationVariables,
  MeQueryVariables,
  UpdateMeMutationVariables,
  UpdateUserMutationVariables,
  UsersQueryVariables,
} from "#/service/gql/generated/gql";

export function useMe(variables?: MeQueryVariables) {
  return useQuery({
    queryKey: ["me", variables],
    queryFn: () => sdk.me(variables),
    retry: false,
  });
}

export function useUsers(variables?: UsersQueryVariables) {
  return useQuery({
    queryKey: ["users", variables],
    queryFn: () => sdk.users(variables),
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateMeMutationVariables) =>
      sdk.updateMe(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateUserMutationVariables) =>
      sdk.updateUser(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useDeleteMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: DeleteMeMutationVariables) =>
      sdk.deleteMe(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: DeleteUserMutationVariables) =>
      sdk.deleteUser(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
