import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DeleteMeMutationVariables,
  DeleteUserMutationVariables,
  MeQueryVariables,
  UpdateMeMutationVariables,
  UpdateUserMutationVariables,
  UsersQueryVariables,
} from "#/service/gql/generated/gql";
import { service } from "#/service/service.client";

export function useMe(variables?: MeQueryVariables) {
  return useQuery({
    queryKey: ["me", variables],
    queryFn: () => service.gql.me(variables),
    retry: false,
  });
}

export function useUsers(variables?: UsersQueryVariables) {
  return useQuery({
    queryKey: ["users", variables],
    queryFn: () => service.gql.users(variables),
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateMeMutationVariables) =>
      service.gql.updateMe(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateUserMutationVariables) =>
      service.gql.updateUser(variables),
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
      service.gql.deleteMe(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: DeleteUserMutationVariables) =>
      service.gql.deleteUser(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
