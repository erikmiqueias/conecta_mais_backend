import { EventStatus } from "@generated/prisma/enums.js";

export interface IUpdateEventStatusRepository {
  execute(eventId: string, status: EventStatus): Promise<boolean>;
}
