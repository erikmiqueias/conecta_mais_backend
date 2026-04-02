import {
  EventNotAuthorizedError,
  EventNotFoundError,
} from "@shared/errors/errors.js";
import { IOSMProvider } from "@shared/middlewares/interfaces/osm.interface.js";

import {
  InputUpdateEventDTO,
  OutputUpdateEventDTO,
} from "../dtos/event.dto.js";
import { IGetEventByIdRepository } from "../repositories/interfaces/get-event-by-id.interface.js";
import { IUpdateEventRepository } from "../repositories/interfaces/update-event.interface.js";
import { generateAccessCode } from "../utils/generate-access-code.js";
import { IUpdateEventUseCase } from "./interfaces/update-event.interface.js";

export class UpdateEventUseCase implements IUpdateEventUseCase {
  constructor(
    private updateEventRepository: IUpdateEventRepository,
    private readonly getEventByIdRepository: IGetEventByIdRepository,
    private readonly geoCoderProvider: IOSMProvider,
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
