import bcrypt from "bcryptjs";

import { InputCreateUserDTO } from "../../dtos/user.dto.js";
import { EmailAlreadyExistsError } from "../../errors/errors.js";
import { ICreateUserRepository } from "../../interfaces/user/repositories/create-user.js";
import { ICreateUserUseCase } from "../../interfaces/user/usecases/create-user.js";
import { GetUserByEmailRepository } from "../../repositories/user/get-user-by-email.js";

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private readonly createUserRepository: ICreateUserRepository,
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
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
