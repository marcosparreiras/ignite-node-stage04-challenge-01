import { randomUUID } from "crypto";
import { Uploader } from "../../domain/shipping/application/storage/uploader";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "../env";

export class TebiStorage implements Uploader {
  private client = new S3Client({
    endpoint: "https://s3.tebi.io",
    region: "global",
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_KEY_ID,
    },
  });

  async upload(
    fileName: string,
    fileType: string,
    body: Buffer
  ): Promise<string> {
    const uniqueFileName = `${fileName}-${randomUUID()}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      })
    );

    return uniqueFileName;
  }
}
