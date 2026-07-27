import { graphql, print } from "graphql";
import { describe, expect, it } from "vitest";
import {
  CreateMediaDocument,
  DeleteMediaDocument,
  GetMediaDocument,
  GetMediasDocument,
} from "@/__tests__/graphql/generated/test-gql";
import {
  closeTestDb,
  createTestContext,
  seedMedia,
  seedUser,
} from "@/__tests__/helpers";
import type { CurrentUser } from "@/shared/graphql/builder";
import { schema } from "@/shared/graphql/schema";

const testUser: CurrentUser = {
  id: "user-test-1",
  email: "test@example.com",
  role: "ADMIN",
};

describe("Media resolvers", () => {
  describe("media query", () => {
    it("returns media by id", async () => {
      const tc = await createTestContext({ user: testUser });
      const user = await seedUser(tc.db, {
        id: testUser.id,
        email: testUser.email,
        role: "ADMIN",
      });
      const mediaRecord = await seedMedia(tc.db, {
        filename: "test-image.jpg",
        type: "IMAGE",
        uploadedBy: user.id,
      });

      const result = await graphql({
        schema,
        source: print(GetMediaDocument),
        variableValues: { id: mediaRecord.id },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        media: {
          filename: string;
          type: string;
          uploader: { id: string; name: string | null; email: string };
        };
      };
      expect(data.media.filename).toBe("test-image.jpg");
      expect(data.media.type).toBe("IMAGE");
      expect(data.media.uploader.email).toBe(testUser.email);
      closeTestDb(tc);
    });
  });

  describe("medias query", () => {
    it("returns paginated media", async () => {
      const tc = await createTestContext({ user: testUser });
      await seedMedia(tc.db, { filename: "file1.jpg" });
      await seedMedia(tc.db, { filename: "file2.jpg" });

      const result = await graphql({
        schema,
        source: print(GetMediasDocument),
        variableValues: { take: 10, skip: 0 },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        medias: {
          items: Array<{ filename: string }>;
          pageInfo: { totalCount: number };
        };
      };
      expect(data.medias.items).toHaveLength(2);
      expect(data.medias.pageInfo.totalCount).toBe(2);
      closeTestDb(tc);
    });
  });

  describe("createMedia mutation", () => {
    it("creates media when authenticated", async () => {
      const tc = await createTestContext({ user: testUser });
      await seedUser(tc.db, { id: testUser.id, role: "ADMIN" });

      const result = await graphql({
        schema,
        source: print(CreateMediaDocument),
        variableValues: {
          input: {
            objectKey: "uploads/new-file.jpg",
            url: "https://example.com/uploads/new-file.jpg",
            filename: "new-file.jpg",
            mimeType: "image/jpeg",
            size: 2048,
            type: "IMAGE",
          },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as {
        createMedia: { filename: string; type: string };
      };
      expect(data.createMedia.filename).toBe("new-file.jpg");
      expect(data.createMedia.type).toBe("IMAGE");
      closeTestDb(tc);
    });

    it("rejects createMedia when unauthenticated", async () => {
      const tc = await createTestContext();

      const result = await graphql({
        schema,
        source: print(CreateMediaDocument),
        variableValues: {
          input: {
            objectKey: "uploads/file.jpg",
            url: "https://example.com/uploads/file.jpg",
            filename: "file.jpg",
            mimeType: "image/jpeg",
            size: 1024,
            type: "IMAGE",
          },
        },
        contextValue: tc.context,
      });

      expect(result.errors).toBeDefined();
      expect(result.errors![0]!.extensions?.code).toBe("UNAUTHORIZED");
      closeTestDb(tc);
    });
  });

  describe("deleteMedia mutation", () => {
    it("deletes media when authenticated", async () => {
      const tc = await createTestContext({ user: testUser });
      await seedUser(tc.db, {
        id: testUser.id,
        email: testUser.email,
        role: "ADMIN",
      });
      const mediaRecord = await seedMedia(tc.db, { filename: "to-delete.jpg" });

      const result = await graphql({
        schema,
        source: print(DeleteMediaDocument),
        variableValues: { id: mediaRecord.id },
        contextValue: tc.context,
      });

      expect(result.errors).toBeUndefined();
      const data = result.data as { deleteMedia: { filename: string } };
      expect(data.deleteMedia.filename).toBe("to-delete.jpg");
      closeTestDb(tc);
    });
  });
});
