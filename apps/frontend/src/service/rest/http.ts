import got, { type Got } from "got";
import type {
  HttpOptions,
  HttpPath,
  HttpSearchParams,
  HttpUploadFile,
} from "./types/http";

class Http {
  private client: Got;

  constructor(prefix: HttpPath, options?: HttpOptions) {
    const headers: Record<string, string> = {};

    if (options?.cookies) {
      headers.Cookie = options.cookies
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
    }

    this.client = got.extend({
      prefixUrl: Http.buildPath(prefix),
      responseType: "json",
      retry: { limit: 2 },
      timeout: { request: 5000 },
      headers,
    });
  }

  get<T>(path: HttpPath, searchParams?: HttpSearchParams) {
    return this.client.get(Http.buildPath(path), { searchParams }).json<T>();
  }

  post<T>(path: HttpPath, body?: unknown, searchParams?: HttpSearchParams) {
    return this.client
      .post(Http.buildPath(path), {
        json: body,
        searchParams,
      })
      .json<T>();
  }

  put<T>(path: HttpPath, body?: unknown, searchParams?: HttpSearchParams) {
    return this.client
      .put(Http.buildPath(path), {
        json: body,
        searchParams,
      })
      .json<T>();
  }

  patch<T>(path: HttpPath, body?: unknown, searchParams?: HttpSearchParams) {
    return this.client
      .patch(Http.buildPath(path), {
        json: body,
        searchParams,
      })
      .json<T>();
  }

  delete<T>(path: HttpPath, searchParams?: HttpSearchParams) {
    return this.client.delete(Http.buildPath(path), { searchParams }).json<T>();
  }

  upload<T>(
    path: HttpPath,
    file: HttpUploadFile,
    body?: Record<string, string>,
    fieldName = "file",
    filename = "upload",
  ) {
    const form = new FormData();

    const blob = file instanceof Blob ? file : new Blob([new Uint8Array(file)]);

    form.append(fieldName, blob, filename);

    if (body) {
      for (const [key, value] of Object.entries(body)) {
        form.append(key, value);
      }
    }

    return this.client
      .post(Http.buildPath(path), {
        body: form,
      })
      .json<T>();
  }

  static buildPath(path: HttpPath): string {
    if (Array.isArray(path)) {
      return path.map((p) => encodeURIComponent(p)).join("/");
    }
    return path;
  }
}

export { Http };
