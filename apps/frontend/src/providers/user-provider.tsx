import { createContext, useContext } from "react";
import type { MeQuery } from "@/services/gql/generated/gql.client";

type UserType = NonNullable<MeQuery["me"]>;

interface UserContextType {
  user: UserType | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  user,
  children,
}: {
  user: UserType | null | undefined;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user: user ?? null }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
}

export function useOptionalUser() {
  const context = useContext(UserContext);
  return context?.user ?? null;
}
