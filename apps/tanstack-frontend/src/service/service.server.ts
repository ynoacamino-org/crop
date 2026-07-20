import { getCookies } from "@tanstack/react-start/server";
import { env } from "#/env";
import { createGqlService } from "./gql/service";
import { createAuthRest } from "./rest/auth";
import { createHttpService } from "./rest/http";
import { createMediaRest } from "./rest/media";

export function createServerService() {
  const cookies = getCookies();
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  const httpService = createHttpService(env.SERVER_URL, { cookieHeader });

  return {
    gql: createGqlService(env.SERVER_URL, { cookieHeader }),
    http: httpService,
    rest: {
      auth: createAuthRest(httpService),
      media: createMediaRest(httpService),
    },
  };
}
