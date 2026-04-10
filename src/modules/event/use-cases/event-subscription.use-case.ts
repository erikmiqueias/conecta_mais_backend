import {
  AccessCodeIsRequiredError,
  EventNotFoundError,
  UserAlreadySubscribedError,
} from "@shared/errors/errors.js";

import { OutputEventSubscriptionDTO } from "../dtos/event.dto.js";
import {
  IEventSubscriptionRepository,
  IGetEventByIdRepository,
  IGetUserSubscribeRepository,
} from "../repositories/index.js";

export class EventSubscriptionUseCase {
  constructor(
    private readonly eventSubscriptionRepository: IEventSubscriptionRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getUserSubscribeRepository: IGetUserSubscribeRepository,
  ) {}
  async execute(
    eventId: string,
    userId: string,
    accessCode?: string,
  ): Promise<OutputEventSubscriptionDTO> {
    const [eventExists, isSubscribe] = await Promise.all([
      this.getEventByIdRepository.execute(eventId),
      this.getUserSubscribeRepository.execute(userId, eventId),
    ]);

    if (!eventExists) throw new EventNotFoundError();

    if (eventExists.organizerId === userId)
      throw new UserAlreadySubscribedError();

    if (isSubscribe) throw new UserAlreadySubscribedError();

    if (
      eventExists.eventType === "PRIVATE" &&
      accessCode !== eventExists.accessCode
    )
      throw new AccessCodeIsRequiredError();

    return await this.eventSubscriptionRepository.execute(eventId, userId);
  }
}
