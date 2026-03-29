import { InputUpdateUserDTO, OutputUpdateUserDTO } from "@dtos/user.dto.js";

export interface IUpdateUserRepository {
  execute(
    userId: string,
    data: InputUpdateUserDTO,
  ): Promise<OutputUpdateUserDTO | null>;
}
