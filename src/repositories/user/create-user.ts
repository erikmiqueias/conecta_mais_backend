import {
  InputCreateUserDTO,
  OutputCreateUserDTO,
} from "../../dtos/user.dto.js";
import { ICreateUserRepository } from "../../interfaces/user/repositories/create-user.js";
import { prisma } from "../../lib/db.js";

export class CreateUserRepository implements ICreateUserRepository {
  async execute(data: InputCreateUserDTO): Promise<OutputCreateUserDTO> {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
      },
    });

    return user;
  }
}
