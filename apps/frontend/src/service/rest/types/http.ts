type HttpPath = string | string[];
type HttpSearchParams = Record<string, string | number | boolean>;
type HttpUploadFile = Blob | Buffer;

type HttpOptions = {
  cookieHeader?: string;
};

export type { HttpOptions, HttpPath, HttpSearchParams, HttpUploadFile };
