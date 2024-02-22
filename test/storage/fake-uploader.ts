import { randomUUID } from "crypto";
import { Uploader } from "../../src/domain/shipping/application/storage/uploader";

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public items: Upload[] = [];

  async upload(
    fileName: string,
    _fileType: string,
    _body: Buffer
  ): Promise<string> {
    const url = `https://www.storage/${fileName}-${randomUUID()}`;
    this.items.push({ fileName, url });
    return url;
  }
}
