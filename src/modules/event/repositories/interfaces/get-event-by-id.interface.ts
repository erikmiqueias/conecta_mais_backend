import { EventStatus } from "@generated/prisma/enums.js";

export interface IGetEventByIdRepository {
  execute(eventId: string): Promise<{
    organizerId: string;
    id: string;
    endDateTime: Date;
    status: EventStatus;
  } | null>;
}
