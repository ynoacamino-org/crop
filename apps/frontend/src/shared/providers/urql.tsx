"use client";

import { Provider } from "urql";
import { service } from "@/service/service.client";

export function UrqlProvider({ children }: { children: React.ReactNode }) {
  return <Provider value={service.gql}>{children}</Provider>;
}
