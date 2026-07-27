import { describe, expect, it } from "vitest";
import {
  getMediaTypeFromMime,
  validateMediaType,
} from "@/modules/media/domain/validation";

describe("validateMediaType", () => {
  describe("when mediaType is IMAGE", () => {
    it.each([
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/avif",
      "image/heic",
    ])("accepts %s", (mime) => {
      expect(validateMediaType(mime, "IMAGE")).toBe(true);
    });

    it.each(["image/bmp", "image/tiff"])("rejects %s", (mime) => {
      expect(validateMediaType(mime, "IMAGE")).toBe(false);
    });

    it("rejects video/mp4 when expecting IMAGE", () => {
      expect(validateMediaType("video/mp4", "IMAGE")).toBe(false);
    });
  });

  describe("when mediaType is VIDEO", () => {
    it.each([
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/x-msvideo",
      "video/avi",
      "video/mkv",
    ])("accepts %s", (mime) => {
      expect(validateMediaType(mime, "VIDEO")).toBe(true);
    });

    it("rejects video/mpeg as an unsupported subtype", () => {
      expect(validateMediaType("video/mpeg", "VIDEO")).toBe(false);
    });
  });

  describe("when mediaType is AUDIO", () => {
    it.each([
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/webm",
      "audio/aac",
      "audio/flac",
    ])("accepts %s", (mime) => {
      expect(validateMediaType(mime, "AUDIO")).toBe(true);
    });

    it("rejects audio/midi as an unsupported subtype", () => {
      expect(validateMediaType("audio/midi", "AUDIO")).toBe(false);
    });
  });

  describe("when mediaType is FILE", () => {
    it.each(["application/pdf", "application/zip", "text/plain", "text/html"])(
      "accepts %s",
      (mime) => {
        expect(validateMediaType(mime, "FILE")).toBe(true);
      },
    );
  });
});

describe("getMediaTypeFromMime", () => {
  it.each(["image/jpeg", "image/png"])("returns IMAGE for %s", (mime) => {
    expect(getMediaTypeFromMime(mime)).toBe("IMAGE");
  });

  it.each(["video/mp4", "video/webm"])("returns VIDEO for %s", (mime) => {
    expect(getMediaTypeFromMime(mime)).toBe("VIDEO");
  });

  it.each(["audio/mpeg", "audio/wav"])("returns AUDIO for %s", (mime) => {
    expect(getMediaTypeFromMime(mime)).toBe("AUDIO");
  });

  it.each(["application/pdf", "text/plain"])("returns FILE for %s", (mime) => {
    expect(getMediaTypeFromMime(mime)).toBe("FILE");
  });

  it("returns FILE for unknown MIME types", () => {
    expect(getMediaTypeFromMime("x-custom/thing")).toBe("FILE");
  });
});
