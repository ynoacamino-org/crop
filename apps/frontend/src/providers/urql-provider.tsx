import { Provider } from "urql";
import { env } from "@/env/client";
import { createGqlService } from "@/services/gql/service";

const client = createGqlService(env.VITE_API_URL);

export function UrqlProvider({ children }: { children: React.ReactNode }) {
  return <Provider value={client}>{children}</Provider>;
}
