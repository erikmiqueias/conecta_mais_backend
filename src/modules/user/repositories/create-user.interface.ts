import {
  InputCreateUserDTO,
  OutputCreateUserDTO,
} from "@modules/user/dtos/user.dto.js";

export interface ICreateUserRepository {
  execute(data: InputCreateUserDTO): Promise<OutputCreateUserDTO>;
}
