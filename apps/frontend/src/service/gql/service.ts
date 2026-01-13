import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cacheExchange, fetchExchange, Client as Service } from "urql";
import { dateExchange } from "./exchanges/date";

type GqlServiceOptions = {
  cookies?: ReadonlyRequestCookies;
};

export const createGqlService = (
  baseUrl: string,
  options?: GqlServiceOptions,
) => {
  const fetchOptions: RequestInit = {};

  if (options?.cookies) {
    fetchOptions.headers = {
      Cookie: options.cookies
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; "),
    };
  }

  return new Service({
    url: `${baseUrl}/graphql`,
    fetchOptions,
    exchanges: [cacheExchange, dateExchange, fetchExchange],
  });
};
