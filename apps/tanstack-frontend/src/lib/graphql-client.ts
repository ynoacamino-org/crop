import { GraphQLClient } from "graphql-request";
import { env } from "#/env";
import { getSdk } from "#/service/gql/generated/gql";

export const graphqlClient = new GraphQLClient(`${env.VITE_API_URL}/graphql`, {
  credentials: "include",
});

export const sdk = getSdk(graphqlClient);
