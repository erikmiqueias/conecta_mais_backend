import { InputCreateUserDTO } from "../../dtos/user.dto.js";
import { prisma } from "../../lib/db.js";

export class CreateUserRepository {
  async execute(data: InputCreateUserDTO) {
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
