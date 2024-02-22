export interface Uploader {
  upload(fileName: string, fileType: string, body: Buffer): Promise<string>;
}
