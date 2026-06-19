import { D1RelationalStore } from "@/lib/stores/db/d1";
import { LibsqlRelationalStore } from "@/lib/stores/db/libsql";
import type { RelationalStore } from "@/lib/stores/db/types";
import { isCloudflareBindings } from "@/lib/stores/detect";
import type { EnvStore } from "@/lib/stores/env/types";

export interface RelationalStoreFactoryOptions {
  env: EnvStore;
  cf?: Cloudflare.Env;
}

export function RelationalStoreFactory(
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
