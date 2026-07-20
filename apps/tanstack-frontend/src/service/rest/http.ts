import ky from "ky";

type HttpServiceOptions = {
  cookieHeader?: string;
};

export function createHttpService(
  baseUrl: string,
  options?: HttpServiceOptions,
) {
  const headers: Record<string, string> = {};
  if (options?.cookieHeader) {
    headers.Cookie = options.cookieHeader;
  }

  return ky.create({
    prefixUrl: baseUrl,
    credentials: "include",
    headers,
  });
}
