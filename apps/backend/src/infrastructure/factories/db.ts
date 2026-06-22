import type { EnvPort } from "@/application/ports/config";
import type { DbPort } from "@/application/ports/db";
import { D1DbPort } from "@/infrastructure/adapters/db/d1";
import { LibsqlDbPort } from "@/infrastructure/adapters/db/libsql";

export interface DbOptions {
  env: EnvPort;
  cf?: Cloudflare.Env;
}

export function createDb(opts: DbOptions): DbPort {
  if (D1DbPort.isConfigured(opts.cf)) {
    return new D1DbPort(opts.cf.DB as D1Database);
  }

  if (LibsqlDbPort.isConfigured(opts.env)) {
    return new LibsqlDbPort(opts.env);
  }

  throw new Error(
    "[db] No hay binding DB (Cloudflare) ni DATABASE_URL (Node) configurados.",
  );
}
