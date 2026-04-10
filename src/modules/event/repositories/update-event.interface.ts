import {
  InputUpdateEventDTO,
  OutputUpdateEventDTO,
} from "@modules/event/dtos/event.dto.js";

export interface IUpdateEventRepository {
  execute(
    eventId: string,
    data: InputUpdateEventDTO,
  ): Promise<OutputUpdateEventDTO>;
}
