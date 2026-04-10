import { checkEvaluationWindow } from "@modules/evaluations/utils/evaluation-window.js";
import { IGetEventByIdRepository } from "@modules/event/repositories/get-event-by-id.interface.js";
import {
  CannotEvaluateCanceledEventError,
  EvaluationNotDisposibleError,
  EventNotAuthorizedError,
  EventNotFoundError,
} from "@shared/errors/errors.js";
import QRCode from "qrcode";

export class GenerateEvaluateQrCodeUseCase {
  constructor(
    private readonly getEventByIdRepository: IGetEventByIdRepository,
  ) {}
  async execute(eventId: string, organizerId: string): Promise<string> {
    const eventExists = await this.getEventByIdRepository.execute(eventId);

    if (!eventExists) {
      throw new EventNotFoundError();
    }

    if (eventExists.organizerId !== organizerId) {
      throw new EventNotAuthorizedError();
    }

    if (eventExists.status === "CANCELED") {
      throw new CannotEvaluateCanceledEventError();
    }

    const evaluateWindow = checkEvaluationWindow(eventExists.endDateTime);

    if (!evaluateWindow.isOpen) {
      throw new EvaluationNotDisposibleError(
        (evaluateWindow.message ?? evaluateWindow.errorCode)!,
      );
    }

    const frontendReactEvaluateURL = `${process.env.FRONTEND_URL}/evaluate/${eventId}`;
    const qrCodeImageBase64 = await QRCode.toDataURL(frontendReactEvaluateURL);

    return qrCodeImageBase64;
  }
}
