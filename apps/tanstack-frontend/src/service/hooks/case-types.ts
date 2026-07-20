import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CaseTypesQueryVariables,
  CreateCaseTypeMutationVariables,
  DeleteCaseTypeMutationVariables,
  UpdateCaseTypeMutationVariables,
} from "#/service/gql/generated/gql";
import { service } from "#/service/service.client";

export function useCaseTypes(variables?: CaseTypesQueryVariables) {
  return useQuery({
    queryKey: ["caseTypes", variables],
    queryFn: () => service.gql.CaseTypes(variables),
  });
}

export function useCreateCaseType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: CreateCaseTypeMutationVariables) =>
      service.gql.CreateCaseType(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseTypes"] });
    },
  });
}

export function useUpdateCaseType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateCaseTypeMutationVariables) =>
      service.gql.UpdateCaseType(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseTypes"] });
    },
  });
}

export function useDeleteCaseType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: DeleteCaseTypeMutationVariables) =>
      service.gql.DeleteCaseType(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseTypes"] });
    },
  });
}
