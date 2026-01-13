import ky, { type KyInstance } from "ky";
import type {
  HttpOptions,
  HttpPath,
  HttpSearchParams,
  HttpUploadFile,
} from "./types/http";

class Http {
  private client: KyInstance;
  private prefix: string;

  constructor(baseUrl: string, prefix: string = "", options?: HttpOptions) {
    const headers: Record<string, string> = {};

    if (options?.cookies) {
      headers.Cookie = options.cookies
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
    }

    this.prefix = prefix;
    this.client = ky.create({
      prefixUrl: baseUrl,
      retry: { limit: 2 },
      timeout: 5000,
      headers,
    });
  }

  get<T>(path: HttpPath, searchParams?: HttpSearchParams) {
    return this.client.get(this.buildPath(path), { searchParams }).json<T>();
  }

  post<T>(path: HttpPath, body?: unknown, searchParams?: HttpSearchParams) {
    return this.client
      .post(this.buildPath(path), {
        json: body,
        searchParams,
      })
      .json<T>();
  }

  put<T>(path: HttpPath, body?: unknown, searchParams?: HttpSearchParams) {
    return this.client
      .put(this.buildPath(path), {
        json: body,
        searchParams,
      })
      .json<T>();
  }

  patch<T>(path: HttpPath, body?: unknown, searchParams?: HttpSearchParams) {
    return this.client
      .patch(this.buildPath(path), {
        json: body,
        searchParams,
      })
      .json<T>();
  }

  delete<T>(path: HttpPath, searchParams?: HttpSearchParams) {
    return this.client.delete(this.buildPath(path), { searchParams }).json<T>();
  }

  upload<T>(
    path: HttpPath,
    file: HttpUploadFile,
    body?: Record<string, string>,
    fieldName = "file",
  ) {
    const form = new FormData();

    const blob = file instanceof Blob ? file : new Blob([new Uint8Array(file)]);
    const filename = file instanceof File ? file.name : "upload";

    form.append(fieldName, blob, filename);

    if (body) {
      for (const [key, value] of Object.entries(body)) {
        form.append(key, value);
      }
    }

    return this.client
      .post(this.buildPath(path), {
        body: form,
      })
      .json<T>();
  }

  private buildPath(path: HttpPath): string {
    const pathArray = Array.isArray(path) ? path : [path];
    const parts = this.prefix ? [this.prefix, ...pathArray] : pathArray;
    return parts.map((p) => encodeURIComponent(p)).join("/");
  }
}

export { Http };
