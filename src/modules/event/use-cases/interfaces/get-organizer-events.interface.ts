import {
  InputGetOrganizerEventsDTO,
  OutputGetOrganizerEventsDTO,
} from "@modules/event/dtos/event.dto.js";

export interface IGetOrganizerEventsUseCase {
  execute(
    organizerId: InputGetOrganizerEventsDTO,
  ): Promise<OutputGetOrganizerEventsDTO>;
}
