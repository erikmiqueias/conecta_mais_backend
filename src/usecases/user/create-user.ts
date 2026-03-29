import bcrypt from "bcryptjs";

import { InputCreateUserDTO } from "../../dtos/user.dto.js";
import { EmailAlreadyExistsError } from "../../errors/errors.js";
import {
  ICreateUserRepository,
  IGetUserByEmailRepository,
} from "../../interfaces/user/repositories/index.js";
import { ICreateUserUseCase } from "../../interfaces/user/usecases/index.js";

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private readonly createUserRepository: ICreateUserRepository,
    private readonly getUserByEmailRepository: IGetUserByEmailRepository,
  ) {}
  async execute(data: InputCreateUserDTO) {
    const emailAlreadyExists = await this.getUserByEmailRepository.execute(
      data.email,
    );

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError();
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.createUserRepository.execute({
      ...data,
      password: hashedPassword,
    });

    return user;
  }
}
