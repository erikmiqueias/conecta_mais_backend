import {
  InputCreateEventDTO,
  OutputCreateEventDTO,
} from "@modules/event/dtos/event.dto.js";

export interface ICreateEventUseCase {
  execute(
    data: InputCreateEventDTO,
    userId: string,
  ): Promise<OutputCreateEventDTO>;
}
