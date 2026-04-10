import { prisma } from "@infra/database/lib/db.js";
import {
  InputCreateUserDTO,
  OutputCreateUserDTO,
} from "@modules/user/dtos/user.dto.js";
import { ICreateUserRepository } from "@modules/user/repositories/create-user.interface.js";

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
