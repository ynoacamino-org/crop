import { describe, expect, it } from "vitest";
import { createEnvConfig } from "@/modules/config/env";
import type { EnvPort } from "@/modules/config/ports/config";

function createMockEnv(vars: Record<string, string | undefined> = {}): EnvPort {
  return {
    get: (key: string) => vars[key],
    getRequired: (key: string) => {
      const val = vars[key];
      if (val === undefined) throw new Error(`Missing required env: ${key}`);
      return val;
    },
    all: () => vars,
  };
}

describe("createEnvConfig", () => {
  it("returns default values when only BETTER_AUTH_SECRET is set", () => {
    const env = createMockEnv({ BETTER_AUTH_SECRET: "secret123" });
    const config = createEnvConfig(env);

    expect(config.nodeEnv).toBe("development");
    expect(config.backendUrl).toBe("http://localhost:7000");
    expect(config.port).toBe(7000);
    expect(config.auth.secret).toBe("secret123");
  });

  it("throws when BETTER_AUTH_SECRET is missing", () => {
    const env = createMockEnv({});
    expect(() => createEnvConfig(env)).toThrow(
      "Missing required env: BETTER_AUTH_SECRET",
    );
  });

  it("reads PORT from the environment", () => {
    const env = createMockEnv({ BETTER_AUTH_SECRET: "s", PORT: "8080" });
    expect(createEnvConfig(env).port).toBe(8080);
  });

  it("reads NODE_ENV from the environment", () => {
    const env = createMockEnv({
      BETTER_AUTH_SECRET: "s",
      NODE_ENV: "production",
    });
    expect(createEnvConfig(env).nodeEnv).toBe("production");
  });

  it("reads BACKEND_URL from the environment", () => {
    const env = createMockEnv({
      BETTER_AUTH_SECRET: "s",
      BACKEND_URL: "https://api.example.com",
    });
    expect(createEnvConfig(env).backendUrl).toBe("https://api.example.com");
  });

  it("reads S3 configuration from the environment", () => {
    const env = createMockEnv({
      BETTER_AUTH_SECRET: "s",
      S3_ACCESS_KEY_ID: "key",
      S3_SECRET_ACCESS_KEY: "secret",
      S3_REGION: "eu-west-1",
      S3_BUCKET_NAME: "my-bucket",
      S3_ENDPOINT: "https://s3.example.com",
      S3_PUBLIC_URL: "https://cdn.example.com",
      S3_FORCE_PATH_STYLE: "true",
    });
    const config = createEnvConfig(env);

    expect(config.s3.accessKeyId).toBe("key");
    expect(config.s3.secretAccessKey).toBe("secret");
    expect(config.s3.region).toBe("eu-west-1");
    expect(config.s3.bucket).toBe("my-bucket");
    expect(config.s3.endpoint).toBe("https://s3.example.com");
    expect(config.s3.publicUrl).toBe("https://cdn.example.com");
    expect(config.s3.forcePathStyle).toBe(true);
  });

  it("uses sensible S3 defaults when env vars are absent", () => {
    const env = createMockEnv({ BETTER_AUTH_SECRET: "s" });
    const config = createEnvConfig(env);

    expect(config.s3.accessKeyId).toBe("");
    expect(config.s3.region).toBe("us-east-1");
    expect(config.s3.bucket).toBe("crop-media");
    expect(config.s3.forcePathStyle).toBe(false);
  });
});
