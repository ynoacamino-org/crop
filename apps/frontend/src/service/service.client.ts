import { API_URL } from "@/shared/config/env";
import { createGqlService } from "./gql/service";
import { RestService } from "./rest/service";

const gqlService = createGqlService(API_URL);
const restService = new RestService(API_URL);

export const service = {
  gql: gqlService,
  rest: restService,
};
