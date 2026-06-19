import { createId } from "@paralleldrive/cuid2";
import { AwsClient } from "aws4fetch";
import { env } from "@/config/env";

export class S3StorageAdapter {
  private client: AwsClient;
  private bucket: string;
  private region: string;
  private endpoint: string;
  private publicUrl: string;

  constructor() {
    this.client = new AwsClient({
      accessKeyId: env.S3_ACCESS_KEY_ID,
      secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      service: "s3",
      region: env.S3_REGION ?? "us-east-1",
      retries: 3,
    });

    this.bucket = env.S3_BUCKET_NAME;
    this.region = env.S3_REGION ?? "us-east-1";
    this.endpoint = env.S3_ENDPOINT;
    this.publicUrl = env.S3_PUBLIC_URL ?? "";
  }

  private getBaseUrl(): string {
    if (this.publicUrl) {
      return this.publicUrl.replace(/\/$/, "");
    }

    if (this.endpoint) {
      const normalized = this.endpoint.replace(/\/$/, "");
      if (env.S3_FORCE_PATH_STYLE === "true") {
        return `${normalized}/${this.bucket}`;
      }
      const host = normalized.replace(/^https?:\/\//, "");
      return `https://${this.bucket}.${host}`;
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com`;
  }

  async upload(params: {
    key: string;
    body: Uint8Array | ReadableStream;
    contentType: string;
    metadata?: Record<string, string>;
  }): Promise<string> {
    const url = `${this.getBaseUrl()}/${params.key}`;

    const headers: Record<string, string> = {
      "Content-Type": params.contentType,
    };

    if (params.metadata) {
      for (const [key, value] of Object.entries(params.metadata)) {
        headers[`x-amz-meta-${key}`] = value;
      }
    }

    const response = await this.client.fetch(url, {
      method: "PUT",
      headers,
      body: params.body as BodyInit,
      aws: {
        service: "s3",
        region: this.region,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`S3 upload failed: ${response.status} ${errorText}`);
    }

    return this.getPublicUrl(params.key);
  }

  async delete(key: string): Promise<void> {
    const url = `${this.getBaseUrl()}/${key}`;

    const response = await this.client.fetch(url, {
      method: "DELETE",
      aws: {
        service: "s3",
        region: this.region,
      },
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      throw new Error(`S3 delete failed: ${response.status} ${errorText}`);
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const url = `${this.getBaseUrl()}/${key}`;
    const urlObj = new URL(url);
    urlObj.searchParams.set("X-Amz-Expires", String(expiresIn));

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
      if (env.S3_FORCE_PATH_STYLE === "true") {
        return `${normalized}/${this.bucket}/${key}`;
      }
      const host = normalized.replace(/^https?:\/\//, "");
      return `https://${this.bucket}.${host}/${key}`;
    }

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  generateKey(prefix: string): string {
    const cuid = createId();
    return `${prefix}/${cuid}`;
  }
}

export const storage = new S3StorageAdapter();
