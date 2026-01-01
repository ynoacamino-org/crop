import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserProvider } from "./user-provider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getSession() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    const response = await fetch(`${API_URL}/api/auth/get-session`, {
      headers: {
        Cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch {
    // Session fetch failed
    return null;
  }
}

export async function ServerUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSession = await getSession();

  if (!userSession || !userSession.user) {
    const cookieStore = await cookies();

    cookieStore.getAll().forEach((cookie) => {
      cookieStore.delete(cookie.name);
    });

    redirect("/login");
  }

  const { user } = userSession;

  return <UserProvider user={user}>{children}</UserProvider>;
}
