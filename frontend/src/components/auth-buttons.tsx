"use client";

import { signIn, signOut, useSession } from "@/lib/auth-client";

export function AuthButtons() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p>Signed in as {session.user.email}</p>
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

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => signIn.social({ provider: "google" })}
        className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
}
