"use client";

import { createContext, useContext } from "react";
import type { MeQuery } from "@/service/gql/generated/gql.node";

const UserContext = createContext<MeQuery["me"] | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: MeQuery["me"];
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
