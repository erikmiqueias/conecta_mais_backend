import { IGetUserByIdRepository } from "@modules/user/repositories/interfaces/get-user-by-id.interface.js";
import { UserNotFoundError } from "@shared/errors/errors.js";
import { IOSMProvider } from "@shared/providers/interfaces/osm.interface.js";

import {
  InputCreateEventDTO,
  OutputCreateEventDTO,
} from "../dtos/event.dto.js";
import { ICreateEventRepository } from "../repositories/interfaces/create-event.interface.js";
import { generateAccessCode } from "../utils/generate-access-code.js";
import { ICreateEventUseCase } from "./interfaces/create-event.interface.js";

export class CreateEventUseCase implements ICreateEventUseCase {
  constructor(
    private readonly createEventRepository: ICreateEventRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly geoCoderProvider: IOSMProvider,
  ) {}

  async execute(
    data: InputCreateEventDTO,
    userId: string,
  ): Promise<OutputCreateEventDTO> {
    const user = await this.getUserByIdRepository.execute(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    if (data.eventAddress && (!data.latitude || !data.longitude)) {
      const { latitude, longitude } =
        await this.geoCoderProvider.getCoordinatesFromAddress(
          data.eventAddress,
        );
      data.latitude = latitude;
      data.longitude = longitude;
    }

    if (data.latitude && data.longitude && !data.eventAddress) {
      const { address } = await this.geoCoderProvider.getAddressFromCoordinates(
        data.latitude,
        data.longitude,
      );
      data.eventAddress = address;
    }

    if (data.eventType === "PRIVATE") {
      const accessCode = generateAccessCode(5);
      data.accessCode = accessCode;
    }

    const eventData = {
      ...data,
      organizerId: userId,
    };
    const event = await this.createEventRepository.execute(eventData, userId);
    return event;
  }
}
