import { mapExchange } from "urql";

function isISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value);
}

function traverse(obj: unknown, fn: (value: unknown) => unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map((v) => traverse(v, fn));
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, traverse(v, fn)]),
    );
  }

  return fn(obj);
}

export const dateExchange = mapExchange({
  onResult(result) {
    if (result.data) {
      traverse(result.data, (value) => {
        if (typeof value === "string" && isISODate(value)) {
          return new Date(value);
        }
        return value;
      });
    }
    return result;
  },
});
