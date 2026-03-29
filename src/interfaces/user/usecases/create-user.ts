import { InputCreateUserDTO, OutputCreateUserDTO } from "@dtos/user.dto.js";

export interface ICreateUserUseCase {
  execute(data: InputCreateUserDTO): Promise<OutputCreateUserDTO>;
}
