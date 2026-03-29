import { OutputGetUserByIdDTO } from "../../dtos/user.dto.js";

export interface IGetUserByIdRepository {
  execute(userId: string): Promise<OutputGetUserByIdDTO | null>;
}
