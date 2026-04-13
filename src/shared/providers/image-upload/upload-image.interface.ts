export interface IUploadOptions {
  folder: "avatars" | "banners" | "events";
  fileName?: string;
}

export interface IUploadImageProvider {
  upload(file: Buffer, options: IUploadOptions): Promise<string>;
}
