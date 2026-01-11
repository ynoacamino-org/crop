type NullToUndefined<T> =
  T extends Record<string, unknown>
    ? {
        [K in keyof T]: NullToUndefined<Exclude<T[K], null>>;
      }
    : Exclude<T, null>;

export function sanitize<T>(obj: T): NullToUndefined<T> {
  if (obj === null) {
    return undefined as NullToUndefined<T>;
  }

  if (typeof obj !== "object" || obj === null) {
    return obj as NullToUndefined<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitize(item)) as NullToUndefined<T>;
  }

  const result = {} as NullToUndefined<T>;

  for (const key in obj) {
    const value = obj[key];
    result[key as keyof NullToUndefined<T>] = sanitize(
      value,
    ) as NullToUndefined<T>[keyof NullToUndefined<T>];
  }

  return result;
}
