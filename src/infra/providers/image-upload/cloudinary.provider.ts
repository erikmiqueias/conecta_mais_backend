import { UploadImageError } from "@shared/errors/errors.js";
import {
  IUploadImageProvider,
  IUploadOptions,
} from "@shared/providers/image-upload/upload-image.interface.js";

import { cloudinary } from "./cloudinary.config.js";

export class CloudinaryProvider implements IUploadImageProvider {
  async upload(file: Buffer, options: IUploadOptions): Promise<string> {
    const isAvatar = options.folder === "avatars";
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `conecta-mais/${options.folder}`,
          resource_type: "image" as const,
          allowed_formats: ["jpg", "png", "jpeg"],
          ...(isAvatar &&
            options.fileName && {
              public_id: options.fileName,
              overwrite: true,
            }),
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new UploadImageError());

          resolve(result.secure_url);
        },
      );
      uploadStream.end(file);
    });
  }
}
