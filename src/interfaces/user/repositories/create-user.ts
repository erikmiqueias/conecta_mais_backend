import { InputCreateUserDTO, OutputCreateUserDTO } from "@dtos/user.dto.js";

export interface ICreateUserRepository {
  execute(data: InputCreateUserDTO): Promise<OutputCreateUserDTO>;
}
