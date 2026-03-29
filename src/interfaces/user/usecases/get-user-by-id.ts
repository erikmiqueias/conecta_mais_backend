import { OutputGetUserByIdDTO } from "@dtos/user.dto.js";

export interface IGetUserByIdUseCase {
  execute(userId: string): Promise<OutputGetUserByIdDTO | null>;
}
