import type { EnvConfig } from "@/modules/config/env";
import { D1DbPort } from "@/modules/database/adapters/d1";
import { LibsqlDbPort } from "@/modules/database/adapters/libsql";
import type { DbPort } from "@/modules/database/ports/db";

export interface DbOptions {
  config: EnvConfig;
  cf?: Cloudflare.Env;
}

export function createDb(opts: DbOptions): DbPort {
  if (D1DbPort.isConfigured(opts.cf)) {
    return new D1DbPort(opts.cf.DB as D1Database);
  }

  if (LibsqlDbPort.isConfigured(opts.config)) {
    return new LibsqlDbPort(opts.config);
  }

  throw new Error(
    "[db] No hay binding DB (Cloudflare) ni DATABASE_URL (Node) configurados.",
  );
}
