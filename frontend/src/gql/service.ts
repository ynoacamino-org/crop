import { cacheExchange, fetchExchange, Client as Service } from "urql";
import { BASE_URL } from "@/shared/config/env";
import { dateExchange } from "./exchanges/date";

export const service = new Service({
  url: `${BASE_URL}/api/graphql`,
  exchanges: [cacheExchange, dateExchange, fetchExchange],
});
