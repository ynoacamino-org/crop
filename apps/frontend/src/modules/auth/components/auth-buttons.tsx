"use client";

import { signOut } from "@/modules/auth/lib/auth-client";
import { useUser } from "@/shared/providers/user-provider";

export function AuthButtons() {
  const user = useUser();

  return (
    <div className="flex flex-col items-center gap-4">
      <p>Signed in as {user.email}</p>
      <button
        type="button"
        onClick={() => signOut()}
        className="rounded-full bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}
