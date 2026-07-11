import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

type HttpPath = string | string[];
type HttpSearchParams = Record<string, string | number | boolean>;
type HttpUploadFile = Blob | Buffer;

type HttpOptions = {
  cookies?: ReadonlyRequestCookies;
};

export type { HttpPath, HttpSearchParams, HttpUploadFile, HttpOptions };
