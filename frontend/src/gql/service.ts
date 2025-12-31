import { cacheExchange, fetchExchange, Client as Service } from "urql";
import { BASE_URL } from "@/shared/config/env";

export const service = new Service({
  url: `${BASE_URL}/graphql`,
  exchanges: [cacheExchange, fetchExchange],
});
