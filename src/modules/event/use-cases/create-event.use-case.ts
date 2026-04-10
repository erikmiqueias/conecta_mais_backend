import { IGetUserByIdRepository } from "@modules/user/repositories/index.js";
import { UserNotFoundError } from "@shared/errors/errors.js";
import { IGeocoderProvider } from "@shared/providers/geocoder/osm.interface.js";
import { IMailQueueProvider } from "@shared/providers/queue/mail-queue-provider.interface.js";

import {
  InputCreateEventDTO,
  OutputCreateEventDTO,
} from "../dtos/event.dto.js";
import { ICreateEventRepository } from "../repositories/index.js";
import { generateAccessCode } from "../utils/generate-access-code.js";

export class CreateEventUseCase {
  constructor(
    private readonly createEventRepository: ICreateEventRepository,
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly geoCoderProvider: IGeocoderProvider,
    private readonly mailProvider: IMailQueueProvider,
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

    const newEvent = await this.createEventRepository.execute(
      eventData,
      userId,
    );

    if (newEvent) {
      await this.mailProvider.addJob({
        to: user.email,
        subject: `Novo evento: ${data.name}`,
        body: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Olá, ${user.username}!</h2>
          <p>Um novo evento foi criado com sucesso:</p>
          <p><strong>${data.name}</strong></p>
          <p>${data.description}</p>
          <br/>
          <p>Um abraço,<br/>Equipe Conecta +</p>
        </div>
        `,
      });
    }

    return newEvent;
  }
}
