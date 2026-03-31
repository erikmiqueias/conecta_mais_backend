import { OutputGetAvailableEventsDTO } from "@modules/event/dtos/event.dto.js";

export interface IGetAvailableEventsUseCase {
  execute(userId?: string): Promise<OutputGetAvailableEventsDTO>;
}
