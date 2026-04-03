import { OutputGetEventParticipantsDTO } from "@modules/event/dtos/event.dto.js";

export interface IGetEventParticipantsUseCase {
  execute(
    eventId: string,
    organizerId: string,
  ): Promise<OutputGetEventParticipantsDTO>;
}
