import {
  EventNotFoundError,
  UserNotSubscribedError,
} from "@shared/errors/errors.js";

import {
  IGetEventByIdRepository,
  IGetUserSubscribeRepository,
  IRemoveParticipantFromEventRepository,
} from "../repositories/interfaces/index.js";
import { IRemoveParticipantFromEventUseCase } from "./interfaces/index.js";

export class RemoveParticipantFromEventUseCase implements IRemoveParticipantFromEventUseCase {
  constructor(
    private readonly removeParticipantFromEventRepository: IRemoveParticipantFromEventRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getUserSubscribeRepository: IGetUserSubscribeRepository,
  ) {}

  async execute(eventId: string, userId: string): Promise<boolean> {
    const [eventExists, isSubscribe] = await Promise.all([
      this.getEventByIdRepository.execute(eventId),
      this.getUserSubscribeRepository.execute(userId, eventId),
    ]);

    if (!eventExists) throw new EventNotFoundError();
    if (!isSubscribe) throw new UserNotSubscribedError();

    return await this.removeParticipantFromEventRepository.execute(
      eventId,
      userId,
    );
  }
}
