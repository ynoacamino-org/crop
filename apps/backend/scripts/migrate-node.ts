#!/usr/bin/env bun
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
/**
 * Aplica las migraciones Drizzle a una base libSQL (on-prem).
 *
 * Uso:
 *   DATABASE_URL=http://localhost:8080 bun run scripts/migrate-node.ts
 *   DATABASE_URL=file:./.data/dev.db bun run scripts/migrate-node.ts
 *
 * Solo para modo Node/Bun. Para D1 usa `wrangler d1 migrations apply`.
 */
import { createClient } from "@libsql/client";

interface ProcessLike {
  env: Record<string, string | undefined>;
}

function getProcess(): ProcessLike | undefined {
  if (typeof globalThis !== "undefined" && "process" in globalThis) {
    const p = (globalThis as { process?: ProcessLike }).process;
    if (p?.env) return p;
  }
  return undefined;
}

function getEnv(key: string): string | undefined {
  return getProcess()?.env[key];
}

function requireEnv(key: string): string {
  const v = getEnv(key);
  if (!v) {
    process.exit(1);
  }
  return v;
}

async function main() {
  const url = requireEnv("DATABASE_URL");
  const migrationsDir = resolve("./drizzle");

  const client = createClient({ url });

  const entries = await readdir(migrationsDir, { withFileTypes: true });
  const dirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  if (dirs.length === 0) {
    return;
  }

  for (const dir of dirs) {
    const sqlPath = join(migrationsDir, dir, "migration.sql");
    const sql = await readFile(sqlPath, "utf-8");
    const statements = sql
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      try {
        await client.execute(stmt);
      } catch (err) {
        const _msg = err instanceof Error ? err.message : String(err);
        throw err;
      }
    }
  }
  client.close();
}

main().catch((_err) => {
  process.exit(1);
});
