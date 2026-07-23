import { cacheExchange, fetchExchange, Client as Service } from "urql";
import { dateExchange } from "./exchanges/date";

type GqlServiceOptions = {
  cookieHeader?: string;
};

export const createGqlService = (
  baseUrl: string,
  options?: GqlServiceOptions,
) => {
  const fetchOptions: RequestInit = {};

  if (options?.cookieHeader) {
    fetchOptions.headers = {
      Cookie: options.cookieHeader,
    };
  }

  return new Service({
    url: `${baseUrl}/graphql`,
    fetchOptions,
    exchanges: [cacheExchange, dateExchange, fetchExchange],
  });
};
