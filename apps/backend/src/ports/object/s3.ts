import { createId } from "@paralleldrive/cuid2";
import { AwsClient } from "aws4fetch";
import type { ObjectStore, ObjectStorePutOptions } from "@/ports/object/port";

export interface S3Config {
  endpoint?: string;
  region?: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicUrl?: string;
  forcePathStyle?: boolean;
}

export class S3ObjectStore implements ObjectStore {
  private client: AwsClient;
  private bucket: string;
  private region: string;
  private endpoint: string;
  private publicUrl: string;
  private forcePathStyle: boolean;
  private readonly ids: () => string;

  constructor(config: S3Config, ids: () => string = () => createId()) {
    this.ids = ids;
    this.client = new AwsClient({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      service: "s3",
      region: config.region ?? "us-east-1",
      retries: 3,
    });
    this.bucket = config.bucket;
    this.region = config.region ?? "us-east-1";
    this.endpoint = config.endpoint ?? "";
    this.publicUrl = config.publicUrl ?? "";
    this.forcePathStyle = config.forcePathStyle ?? false;
  }

  private getBaseUrl(): string {
    if (this.publicUrl) {
      return this.publicUrl.replace(/\/$/, "");
    }
    if (this.endpoint) {
      const normalized = this.endpoint.replace(/\/$/, "");
      if (this.forcePathStyle) {
        return `${normalized}/${this.bucket}`;
      }
      const host = normalized.replace(/^https?:\/\//, "");
      return `https://${this.bucket}.${host}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com`;
  }

  async put(
    key: string,
    body: Uint8Array | ReadableStream,
    options: ObjectStorePutOptions,
  ): Promise<string> {
    const url = `${this.getBaseUrl()}/${key}`;

    const headers: Record<string, string> = {
      "Content-Type": options.contentType,
    };

    if (options.metadata) {
      for (const [k, v] of Object.entries(options.metadata)) {
        headers[`x-amz-meta-${k}`] = v;
      }
    }

    const response = await this.client.fetch(url, {
      method: "PUT",
      headers,
      body: body as BodyInit,
      aws: { service: "s3", region: this.region },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`S3 upload failed: ${response.status} ${errorText}`);
    }

    return this.getPublicUrl(key);
  }

  async delete(key: string): Promise<void> {
    const url = `${this.getBaseUrl()}/${key}`;

    const response = await this.client.fetch(url, {
      method: "DELETE",
      aws: { service: "s3", region: this.region },
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      throw new Error(`S3 delete failed: ${response.status} ${errorText}`);
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const url = `${this.getBaseUrl()}/${key}`;

    const request = await this.client.sign(url, {
      method: "GET",
      aws: {
        service: "s3",
        region: this.region,
        signQuery: true,
        appendSessionToken: false,
      },
    });

    const signedUrl = new URL(request.url);
    signedUrl.searchParams.set("X-Amz-Expires", String(expiresIn));
    return signedUrl.toString();
  }

  getPublicUrl(key: string): string {
    if (this.publicUrl) {
      return `${this.publicUrl.replace(/\/$/, "")}/${key}`;
    }
    if (this.endpoint) {
      const normalized = this.endpoint.replace(/\/$/, "");
      if (this.forcePathStyle) {
        return `${normalized}/${this.bucket}/${key}`;
      }
      const host = normalized.replace(/^https?:\/\//, "");
      return `https://${this.bucket}.${host}/${key}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  generateKey(prefix: string): string {
    return `${prefix}/${this.ids()}`;
  }
}
