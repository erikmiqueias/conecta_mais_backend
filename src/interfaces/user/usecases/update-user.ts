import { InputUpdateUserDTO, OutputUpdateUserDTO } from "@dtos/user.dto.js";

export interface IUpdateUserUseCase {
  execute(
    userId: string,
    data: InputUpdateUserDTO,
  ): Promise<OutputUpdateUserDTO | null>;
}
