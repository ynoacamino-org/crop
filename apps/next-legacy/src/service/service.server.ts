import { cookies } from "next/headers";
import { INTERNAL_API_URL } from "@/shared/config/env";
import { createGqlService } from "./gql/service";
import { RestService } from "./rest/service";

export const getService = async () => {
  const cookieStore = await cookies();

  const gqlService = createGqlService(INTERNAL_API_URL, {
    cookies: cookieStore,
  });
  const restService = new RestService(INTERNAL_API_URL, {
    cookies: cookieStore,
  });

  return {
    gql: gqlService,
    rest: restService,
  };
};
