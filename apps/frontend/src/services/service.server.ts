import { getCookies } from "@tanstack/react-start/server";
import { env } from "@/env/server";
import { createGqlService } from "@/services/gql/service";
import { RestService } from "@/services/rest/service";

export function createServerService() {
  const cookies = getCookies();
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");

  const gqlService = createGqlService(env.SERVER_URL, { cookieHeader });
  const restService = new RestService(env.SERVER_URL, { cookieHeader });

  return {
    gql: gqlService,
    rest: restService,
  };
}
