import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sdk } from "#/lib/graphql-client";
import type {
  CaseTypesQueryVariables,
  CreateCaseTypeMutationVariables,
  DeleteCaseTypeMutationVariables,
  UpdateCaseTypeMutationVariables,
} from "#/service/gql/generated/gql";

export function useCaseTypes(variables?: CaseTypesQueryVariables) {
  return useQuery({
    queryKey: ["caseTypes", variables],
    queryFn: () => sdk.CaseTypes(variables),
  });
}

export function useCreateCaseType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: CreateCaseTypeMutationVariables) =>
      sdk.CreateCaseType(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseTypes"] });
    },
  });
}

export function useUpdateCaseType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateCaseTypeMutationVariables) =>
      sdk.UpdateCaseType(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseTypes"] });
    },
  });
}

export function useDeleteCaseType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: DeleteCaseTypeMutationVariables) =>
      sdk.DeleteCaseType(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseTypes"] });
    },
  });
}
