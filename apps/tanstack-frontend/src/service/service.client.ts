import { env } from "#/env";
import { createGqlService } from "./gql/service";
import { RestService } from "./rest/service";

const gqlService = createGqlService(env.VITE_API_URL);
const restService = new RestService(env.VITE_API_URL);

export const service = {
  gql: gqlService,
  rest: restService,
};
