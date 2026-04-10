import {
  EventNotAuthorizedError,
  EventNotFoundError,
} from "@shared/errors/errors.js";
import { IGeocoderProvider } from "@shared/providers/geocoder/osm.interface.js";

import {
  InputUpdateEventDTO,
  OutputUpdateEventDTO,
} from "../dtos/event.dto.js";
import {
  IGetEventByIdRepository,
  IUpdateEventRepository,
} from "../repositories/interfaces/index.js";
import { generateAccessCode } from "../utils/generate-access-code.js";
import { IUpdateEventUseCase } from "./interfaces/index.js";

export class UpdateEventUseCase implements IUpdateEventUseCase {
  constructor(
    private updateEventRepository: IUpdateEventRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly geoCoderProvider: IGeocoderProvider,
  ) {}
  async execute(
    eventId: string,
    userId: string,
    data: InputUpdateEventDTO,
  ): Promise<OutputUpdateEventDTO> {
    const eventExists = await this.getEventByIdRepository.execute(eventId);

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
