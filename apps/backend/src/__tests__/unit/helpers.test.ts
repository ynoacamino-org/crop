import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { InMemoryCache } from "@/__tests__/helpers/in-memory-cache";
import { InMemoryObjectStorage } from "@/__tests__/helpers/in-memory-objects";

describe("Test Helpers (ioredis-mock & s3rver)", () => {
  describe("InMemoryCache (ioredis-mock)", () => {
    it("stores, retrieves, lists, and deletes cached values using ioredis-mock", async () => {
      const cache = new InMemoryCache();

      await cache.put("test:key1", "value1");
      await cache.put("test:key2", "value2", { ttl: 60 });

      const val1 = await cache.get("test:key1");
      expect(val1).toBe("value1");

      const keys = await cache.list("test:");
      expect(keys).toContain("test:key1");
      expect(keys).toContain("test:key2");

      await cache.delete("test:key1");
      const deletedVal = await cache.get("test:key1");
      expect(deletedVal).toBeNull();

      await cache.flushall();
      const emptyKeys = await cache.list("test:");
      expect(emptyKeys).toEqual([]);
    });
  });

  describe("InMemoryObjectStorage (s3rver)", () => {
    let storage: InMemoryObjectStorage;

    beforeAll(async () => {
      storage = new InMemoryObjectStorage({ port: 4571 });
      await storage.start();
    });

    afterAll(async () => {
      await storage.stop();
    });

    it("uploads, retrieves URLs, and deletes S3 objects via s3rver", async () => {
      const key = storage.generateKey("test-folder");
      const data = new TextEncoder().encode("Hello S3rver Test!");

      const publicUrl = await storage.put(key, data, {
        contentType: "text/plain",
      });

      expect(publicUrl).toContain(key);

      const signedUrl = await storage.getSignedUrl(key, 300);
      expect(signedUrl).toContain(key);

      await storage.delete(key);
    });
  });
});
