export function isCloudflareBindings(value: unknown): value is Cloudflare.Env {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    "DB" in v ||
    "KV" in v ||
    "MY_BUCKET" in v ||
    "ASSETS" in v ||
    "DURABLE_OBJECTS" in v
  );
}
