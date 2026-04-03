import { EmailAlreadyExistsError } from "@shared/errors/errors.js";
import bcrypt from "bcryptjs";

import { InputCreateUserDTO } from "../dtos/user.dto.js";
import {
  ICreateUserRepository,
  IGetUserByEmailRepository,
} from "../repositories/interfaces/index.js";
import { ICreateUserUseCase } from "./interfaces/index.js";

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
    return await this.createUserRepository.execute({
      ...data,
      password: hashedPassword,
    });
  }
}
