import {
  EventNotFoundError,
  UserAlreadySubscribedError,
} from "@shared/errors/errors.js";

import { OutputEventSubscriptionDTO } from "../dtos/event.dto.js";
import {
  IEventSubscriptionRepository,
  IGetEventByIdRepository,
  IGetUserSubscribeRepository,
} from "../repositories/interfaces/index.js";
import { IEventSubscriptionUseCase } from "./interfaces/index.js";

export class EventSubscriptionUseCase implements IEventSubscriptionUseCase {
  constructor(
    private readonly eventSubscriptionRepository: IEventSubscriptionRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getUserSubscribeRepository: IGetUserSubscribeRepository,
  ) {}
  async execute(
    eventId: string,
    userId: string,
  ): Promise<OutputEventSubscriptionDTO> {
    const eventExists = await this.getEventByIdRepository.execute(eventId);

    if (!eventExists) throw new EventNotFoundError();

    if (eventExists.organizerId === userId)
      throw new UserAlreadySubscribedError();

    const isSubscribe = await this.getUserSubscribeRepository.execute(
      userId,
      eventId,
    );

    if (isSubscribe) throw new UserAlreadySubscribedError();

    return await this.eventSubscriptionRepository.execute(eventId, userId);
  }
}
