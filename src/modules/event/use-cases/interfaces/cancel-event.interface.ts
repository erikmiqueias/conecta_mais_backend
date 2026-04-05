import { EventStatus } from "@generated/prisma/enums.js";

export interface ICancelEventUseCase {
  execute(
    organizerId: string,
    eventId: string,
    status: EventStatus,
  ): Promise<boolean>;
}
