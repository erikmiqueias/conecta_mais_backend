import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  EventNotFoundError,
  UserNotFoundError,
  UserNotSubscribedError,
} from "@shared/errors/errors.js";

import {
  IGetEventByIdRepository,
  IGetUserSubscribeRepository,
  IRemoveParticipantFromEventRepository,
} from "../repositories/index.js";

export class RemoveParticipantFromEventUseCase {
  constructor(
    private readonly removeParticipantFromEventRepository: IRemoveParticipantFromEventRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getUserSubscribeRepository: IGetUserSubscribeRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
  ) {}

  async execute(eventId: string, userId: string): Promise<boolean> {
    const [eventExists, isSubscribe, userExists] = await Promise.all([
      this.getEventByIdRepository.execute(eventId),
      this.getUserSubscribeRepository.execute(userId, eventId),
      this.getUserByIdRepository.execute(userId),
    ]);

    if (!eventExists) throw new EventNotFoundError();
    if (!isSubscribe) throw new UserNotSubscribedError();
    if (!userExists) throw new UserNotFoundError();

    if (!userExists.emailVerified) throw new EmailIsNotVerifiedError();

    return await this.removeParticipantFromEventRepository.execute(
      eventId,
      userId,
    );
  }
}
