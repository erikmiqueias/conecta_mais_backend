import { OutputGetEventParticipantsDTO } from "@modules/event/dtos/event.dto.js";

export interface IGetEventParticipantsRepository {
  execute(
    eventId: string,
    organizerId: string,
  ): Promise<OutputGetEventParticipantsDTO>;
}
