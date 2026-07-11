import { createContext, useContext } from "react";
import type { MeQuery } from "#/service/gql/generated/gql";

type UserType = NonNullable<MeQuery["me"]>;

const UserContext = createContext<UserType | undefined>(undefined);

export function UserProvider({
  user,
  children,
}: {
  user: UserType | null | undefined;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={user || undefined}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function useOptionalUser() {
  return useContext(UserContext);
}
