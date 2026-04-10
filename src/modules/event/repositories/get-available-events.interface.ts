import { OutputGetAvailableEventsDTO } from "@modules/event/dtos/event.dto.js";

export interface IGetAvailableEventsRepository {
  execute(userId?: string): Promise<OutputGetAvailableEventsDTO>;
}
