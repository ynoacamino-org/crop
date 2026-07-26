import { env } from "@/env/client";
import { createGqlService } from "@/services/gql/service";
import { RestService } from "@/services/rest/service";

const gqlService = createGqlService(env.VITE_API_URL);
const restService = new RestService(env.VITE_API_URL);

export const service = {
  gql: gqlService,
  rest: restService,
};
