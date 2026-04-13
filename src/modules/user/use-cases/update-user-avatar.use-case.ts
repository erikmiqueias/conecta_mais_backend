import { UserNotFoundError } from "@shared/errors/errors.js";
import { IUploadImageProvider } from "@shared/providers/image-upload/upload-image.interface.js";

import { IGetUserByIdRepository } from "../repositories/get-user-by-id.interface.js";
import { IUpdateUserAvatarRepository } from "../repositories/update-user-avatar.interface.js";

export class UpdateUserAvatarUseCase {
  constructor(
    private readonly uploadImageRepository: IUpdateUserAvatarRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly uploadImageProvider: IUploadImageProvider,
  ) {}
  async execute(userId: string, avatar: Buffer): Promise<void> {
    const userExists = await this.getUserByIdRepository.execute(userId);

    if (!userExists) throw new UserNotFoundError();

    const avatarUrl = await this.uploadImageProvider.upload(avatar, {
      folder: "avatars",
      fileName: userId,
    });

    if (!avatarUrl) return;

    await this.uploadImageRepository.execute(userId, avatarUrl);
  }
}
