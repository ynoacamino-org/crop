"use client";

import { Provider } from "urql";
import { service } from "@/gql/service";

export function UrqlProvider({ children }: { children: React.ReactNode }) {
  return <Provider value={service}>{children}</Provider>;
}
