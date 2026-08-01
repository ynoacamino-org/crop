import { eq } from "drizzle-orm";
import { runtime } from "@/bootstrap/runtime";
import type { RuntimeEnv } from "@/bootstrap/types";
import { users } from "@/domain/db/schema";
import type { DatabaseClient } from "@/modules/database/ports/db";
import type { CurrentUser } from "@/shared/graphql/builder";

export interface AppContext {
  user?: CurrentUser;
  db: DatabaseClient;
  runtime: RuntimeEnv;
  request: Request;
}

async function resolveUser(rt: RuntimeEnv, request: Request) {
  const session = await rt.auth.api.getSession({
    headers: request.headers,
  });
  if (session?.user) {
    return session.user;
  }

  const apiKey = request.headers.get("x-api-key");
  if (apiKey) {
    const result = await rt.auth.api.verifyApiKey({
      body: { key: apiKey },
    });
    if (result.valid && result.key) {
      const [user] = await rt.db.client
        .select()
        .from(users)
        .where(eq(users.id, result.key.referenceId))
        .limit(1);
      if (user) return user;
    }
  }

  return null;
}

export async function buildContext(
  rt: RuntimeEnv,
  request: Request,
): Promise<AppContext> {
  let user = await resolveUser(rt, request);

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
    request,
  };
}

export function createRuntime(cf?: Cloudflare.Env): RuntimeEnv {
  return runtime.create({ cf });
}
