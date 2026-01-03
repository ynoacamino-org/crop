import { cookies } from "next/headers";
import { cacheExchange, fetchExchange, Client as Service } from "urql";
import { BASE_URL } from "@/shared/config/env";
import { dateExchange } from "./exchanges/date";

export const getService = async () => {
  const cookieStore = await cookies();

  return new Service({
    url: `${BASE_URL}/api/graphql`,
    fetchOptions: {
      headers: {
        Cookie: cookieStore
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join("; "),
      },
    },
    exchanges: [cacheExchange, dateExchange, fetchExchange],
  });
};
