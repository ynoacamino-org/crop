import { createId } from "@paralleldrive/cuid2";
import { AwsClient } from "aws4fetch";
import type { EnvConfig } from "@/modules/config/env";
import type {
  ObjectPort,
  ObjectPortPutOptions,
} from "@/modules/object-storage/ports/storage";

export class S3ObjectPort implements ObjectPort {
  private client: AwsClient;
  private bucket: string;
  private region: string;
  private endpoint: string;
  private publicUrl: string;
  private forcePathStyle: boolean;
  private readonly ids: () => string;

  static isConfigured(config: EnvConfig): boolean {
    return !!(config.s3.accessKeyId && config.s3.secretAccessKey);
  }

  constructor(config: EnvConfig, ids: () => string = () => createId()) {
    this.ids = ids;

    this.client = new AwsClient({
      accessKeyId: config.s3.accessKeyId,
      secretAccessKey: config.s3.secretAccessKey,
      service: "s3",
      region: config.s3.region,
      retries: 3,
    });
    this.bucket = config.s3.bucket;
    this.region = config.s3.region;
    this.endpoint = config.s3.endpoint;
    this.publicUrl = config.s3.publicUrl;
    this.forcePathStyle = config.s3.forcePathStyle;
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
    options: ObjectPortPutOptions,
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
