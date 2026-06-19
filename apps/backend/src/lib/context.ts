import { eq } from "drizzle-orm";
import type { CurrentUser } from "@/builder";
import { users } from "@/db/schema";
import type { DatabaseClient } from "@/ports/db/port";
import { runtime } from "@/ports/runtime";
import type { RuntimeEnv } from "@/ports/runtime/port";

export interface AppContext {
  user?: CurrentUser;
  db: DatabaseClient;
  runtime: RuntimeEnv;
}

export async function buildContext(
  rt: RuntimeEnv,
  request: Request,
): Promise<AppContext> {
  const session = await rt.auth.api.getSession({
    headers: request.headers,
  });
  let user = session?.user ?? null;

  if (user && user.email === "ynoacamino@gmail.com" && user.role !== "ADMIN") {
    await rt.db.client
      .update(users)
      .set({ role: "ADMIN" })
      .where(eq(users.id, user.id));
    user = { ...user, role: "ADMIN" };
  }

  const currentUser: CurrentUser | undefined = user
    ? {
        id: user.id,
        email: user.email,
        role: (user.role as CurrentUser["role"]) ?? "PUBLIC",
      }
    : undefined;

  return {
    user: currentUser,
    db: rt.db.client,
    runtime: rt,
  };
}

export function createRuntime(cf?: Cloudflare.Env): RuntimeEnv {
  return runtime.create({ cf });
}
