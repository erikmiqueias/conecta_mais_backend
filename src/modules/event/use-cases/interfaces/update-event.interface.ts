import {
  InputUpdateEventDTO,
  OutputUpdateEventDTO,
} from "@modules/event/dtos/event.dto.js";

export interface IUpdateEventUseCase {
  execute(
    eventId: string,
    userId: string,
    data: InputUpdateEventDTO,
  ): Promise<OutputUpdateEventDTO>;
}
