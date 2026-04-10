import { OutputGetEventByIdDTO } from "../dtos/event.dto.js";

export interface IGetEventByIdRepository {
  execute(eventId: string): Promise<OutputGetEventByIdDTO | null>;
}
