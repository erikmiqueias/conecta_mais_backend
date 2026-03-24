import bcrypt from "bcrypt";

import { InputCreateUserDTO } from "../../dtos/user.dto.js";
import { EmailAlreadyExistsError } from "../../errors/errors.js";
import { CreateUserRepository } from "../../repositories/user/create-user.js";
import { GetUserByEmailRepository } from "../../repositories/user/get-user-by-email.js";

export class CreateUserUseCase {
  async execute(data: InputCreateUserDTO) {
    const emailAlreadyExists = await new GetUserByEmailRepository().execute(
      data.email,
    );

    if (emailAlreadyExists) {
      throw new EmailAlreadyExistsError();
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new CreateUserRepository().execute({
      ...data,
      password: hashedPassword,
    });

    return user;
  }
}
