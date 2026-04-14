import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  EmailIsNotVerifiedError,
  EventNotAuthorizedError,
  EventNotFoundError,
  UserNotFoundError,
} from "@shared/errors/errors.js";
import { IGeocoderProvider } from "@shared/providers/geocoder/osm.interface.js";

import {
  InputUpdateEventDTO,
  OutputUpdateEventDTO,
} from "../dtos/event.dto.js";
import {
  IGetEventByIdRepository,
  IUpdateEventRepository,
} from "../repositories/index.js";
import { generateAccessCode } from "../utils/generate-access-code.js";

export class UpdateEventUseCase {
  constructor(
    private updateEventRepository: IUpdateEventRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly geoCoderProvider: IGeocoderProvider,
  ) {}
  async execute(
    eventId: string,
    userId: string,
    data: InputUpdateEventDTO,
  ): Promise<OutputUpdateEventDTO> {
    const [userExists, eventExists] = await Promise.all([
      this.getUserByIdRepository.execute(userId),
      this.getEventByIdRepository.execute(eventId),
    ]);

    if (!userExists) {
      throw new UserNotFoundError();
    }

    if (!userExists.emailVerified) {
      throw new EmailIsNotVerifiedError();
    }

    if (!eventExists) {
      throw new EventNotFoundError();
    }

    if (eventExists.organizerId !== userId) {
      throw new EventNotAuthorizedError();
    }

    if (data.eventAddress) {
      const { latitude, longitude } =
        await this.geoCoderProvider.getCoordinatesFromAddress(
          data.eventAddress,
        );

      data.latitude = latitude;
      data.longitude = longitude;
    }

    if (data.eventType && data.eventType === "PRIVATE") {
      data.accessCode = generateAccessCode(5);
    }

    return await this.updateEventRepository.execute(eventId, data);
  }
}
