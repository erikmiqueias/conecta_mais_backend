import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  EventNotAuthorizedError,
  EventNotFoundError,
  UserNotFoundError,
} from "@shared/errors/errors.js";
import { IUploadImageProvider } from "@shared/providers/image-upload/upload-image.interface.js";

import { IGetEventByIdRepository } from "../repositories/get-event-by-id.interface.js";
import { IUpdateEventBannerRepository } from "../repositories/update-event-banner.interface.js";

export class UpdateEventBannerUseCase {
  constructor(
    private readonly updateEventBannerRepository: IUpdateEventBannerRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly uploadImageProvider: IUploadImageProvider,
  ) {}
  async execute(userId: string, eventId: string, banner: Buffer) {
    const [userExists, eventExists] = await Promise.all([
      this.getUserByIdRepository.execute(userId),
      this.getEventByIdRepository.execute(eventId),
    ]);

    if (!userExists) throw new UserNotFoundError();
    if (!userExists.emailVerified) throw new EmailIsNotVerifiedError();

    if (!eventExists) throw new EventNotFoundError();

    const isOwner = eventExists.organizerId === userId;
    if (!isOwner) throw new EventNotAuthorizedError();

    const bannerUrl = await this.uploadImageProvider.upload(banner, {
      folder: "banners",
      fileName: eventId,
    });

    return await this.updateEventBannerRepository.execute(eventId, bannerUrl);
  }
}
