import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";
import {
  AccessCodeIsRequiredError,
  EmailIsNotVerifiedError,
  EventNotFoundError,
  UserAlreadySubscribedError,
  UserNotFoundError,
} from "@shared/errors/errors.js";
import { IMailQueueProvider } from "@shared/providers/queue/mail-queue-provider.interface.js";
import * as QRCode from "qrcode";

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
    private readonly getUserByIdRepository: IGetUserByIdRepository,
    private readonly mailProvider: IMailQueueProvider,
  ) {}
  async execute(
    eventId: string,
    userId: string,
    accessCode?: string,
  ): Promise<OutputEventSubscriptionDTO> {
    const [eventExists, isSubscribe, userExists] = await Promise.all([
      this.getEventByIdRepository.execute(eventId),
      this.getUserSubscribeRepository.execute(userId, eventId),
      this.getUserByIdRepository.execute(userId),
    ]);

    if (!eventExists) throw new EventNotFoundError();
    if (!userExists) throw new UserNotFoundError();
    if (eventExists.organizerId === userId)
      throw new UserAlreadySubscribedError();
    if (isSubscribe) throw new UserAlreadySubscribedError();

    if (!userExists.emailVerified) throw new EmailIsNotVerifiedError();

    if (
      eventExists.eventType === "PRIVATE" &&
      accessCode !== eventExists.accessCode
    ) {
      throw new AccessCodeIsRequiredError();
    }

    const subscription = await this.eventSubscriptionRepository.execute(
      eventId,
      userId,
    );

    if (subscription) {
      const checkinUrl = `https://conectamais.com/checkin/${subscription.id}`;
      const qrCodeDataUri = await QRCode.toDataURL(checkinUrl);

      const qrCodeBase64 = qrCodeDataUri.split(",")[1];

      await Promise.all([
        this.mailProvider.addJob({
          to: userExists.email,
          subject: `Ingresso Confirmado: ${eventExists.name}`,
          body: `
          <h1>Olá ${userExists.username}!</h1>
          <p>Sua inscrição no evento <strong>${eventExists.name}</strong> foi realizada com sucesso.</p>
          <p>Apresente o QR Code em anexo no dia do evento para realizar o seu check-in.</p>
        `,
          attachments: [
            {
              filename: "qrcode-checkin.png",
              content: qrCodeBase64,
            },
          ],
        }),

        this.mailProvider.addJob({
          to: eventExists.organizer.email,
          subject: "Novo participante inscrito",
          body: `Um novo participante se inscreveu no seu evento ${eventExists.name}.`,
        }),
      ]);
    }

    return subscription;
  }
}
