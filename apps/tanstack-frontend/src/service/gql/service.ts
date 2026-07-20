import { GraphQLClient } from "graphql-request";
import { getSdk } from "#/service/gql/generated/gql";

type GqlServiceOptions = {
  cookieHeader?: string;
};

export function createGqlService(baseUrl: string, options?: GqlServiceOptions) {
  const headers: Record<string, string> = {};
  if (options?.cookieHeader) {
    headers.Cookie = options.cookieHeader;
  }

  const client = new GraphQLClient(`${baseUrl}/graphql`, {
    credentials: "include",
    headers,
  });

  return getSdk(client);
}
