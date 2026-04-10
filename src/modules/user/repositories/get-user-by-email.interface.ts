import { OutputGetUserByEmailDTO } from "@modules/user/dtos/user.dto.js";

export interface IGetUserByEmailRepository {
  execute(email: string): Promise<OutputGetUserByEmailDTO | null>;
}
