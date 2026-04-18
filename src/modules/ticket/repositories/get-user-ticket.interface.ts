import { OutputGetUserTicketsDTO } from "../dtos/ticket.dto.js";

export interface IGetUserTicketsRepository {
  execute(userId: string): Promise<OutputGetUserTicketsDTO>;
}
