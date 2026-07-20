import { env } from "#/env";
import { createGqlService } from "./gql/service";
import { createAuthRest } from "./rest/auth";
import { createHttpService } from "./rest/http";
import { createMediaRest } from "./rest/media";

const httpService = createHttpService(env.VITE_API_URL);

export const service = {
  gql: createGqlService(env.VITE_API_URL),
  http: httpService,
  rest: {
    auth: createAuthRest(httpService),
    media: createMediaRest(httpService),
  },
};
