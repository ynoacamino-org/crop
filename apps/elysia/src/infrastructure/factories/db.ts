import type { EnvPort } from "@/application/ports/config";
import type { DbPort } from "@/application/ports/db";
import { LibsqlDbPort } from "@/infrastructure/adapters/db/libsql";

export function createDb(env: EnvPort): DbPort {
  if (LibsqlDbPort.isConfigured(env)) {
    return new LibsqlDbPort(env);
  }

  throw new Error("[db] DATABASE_URL no configurado.");
}
