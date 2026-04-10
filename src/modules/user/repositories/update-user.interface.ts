import {
  InputUpdateUserDTO,
  OutputUpdateUserDTO,
} from "@modules/user/dtos/user.dto.js";

export interface IUpdateUserRepository {
  execute(
    userId: string,
    data: InputUpdateUserDTO,
  ): Promise<OutputUpdateUserDTO | null>;
}
