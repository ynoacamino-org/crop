import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createId } from "@paralleldrive/cuid2";
import { env } from "@/config/env";

export class S3StorageAdapter {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      region: env.S3_REGION || "auto",
      endpoint: env.S3_ENDPOINT,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      },
      forcePathStyle: env.S3_FORCE_PATH_STYLE === "true",
    });

    this.bucket = env.S3_BUCKET_NAME;
  }

  async upload(params: {
    key: string;
    body: Buffer | Uint8Array | ReadableStream;
    contentType: string;
    metadata?: Record<string, string>;
  }): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
      Metadata: params.metadata,
    });

    await this.client.send(command);

    return this.getPublicUrl(params.key);
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.client.send(command);
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.client, command, { expiresIn });
  }

  getPublicUrl(key: string): string {
    if (env.S3_PUBLIC_URL) {
      return `${env.S3_PUBLIC_URL}/${key}`;
    }

    if (env.S3_ENDPOINT) {
      return `${env.S3_ENDPOINT}/${this.bucket}/${key}`;
    }

    return "";
  }

  generateKey(prefix: string): string {
    const cuid = createId();
    return `${prefix}/${cuid}`;
  }
}

export const storage = new S3StorageAdapter();
