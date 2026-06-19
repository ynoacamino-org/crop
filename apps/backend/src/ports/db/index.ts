import type { EnvStore } from "@/ports/config/port";
import { D1RelationalStore } from "@/ports/db/d1";
import { LibsqlRelationalStore } from "@/ports/db/libsql";
import type { RelationalStore } from "@/ports/db/port";
import { isCloudflareBindings } from "@/ports/detect";

export interface RelationalStoreFactoryOptions {
  env: EnvStore;
  cf?: Cloudflare.Env;
}

export function createRelationalStore(
  opts: RelationalStoreFactoryOptions,
): RelationalStore {
  if (opts.cf && isCloudflareBindings(opts.cf) && "DB" in opts.cf) {
    return new D1RelationalStore(opts.cf.DB as D1Database);
  }

  const url = opts.env.get("DATABASE_URL");
  if (!url) {
    throw new Error(
      "[db] No hay binding DB (Cloudflare) ni DATABASE_URL (Node) configurados.",
    );
  }
  return new LibsqlRelationalStore(url);
}
