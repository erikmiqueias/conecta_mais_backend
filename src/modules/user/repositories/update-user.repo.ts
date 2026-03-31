import { prisma } from "@shared/lib/db.js";

import { InputUpdateUserDTO, OutputUpdateUserDTO } from "../dtos/user.dto.js";
import { IUpdateUserRepository } from "./interfaces/update-user.interface.js";

export class UpdateUserRepository implements IUpdateUserRepository {
  async execute(
    userId: string,
    data: InputUpdateUserDTO,
  ): Promise<OutputUpdateUserDTO | null> {
    const user = await prisma.user.update({
      data: {
        email: data.email,
        username: data.username,
      },
      where: {
        id: userId,
        deletedAt: null,
      },
    });
    return user;
  }
}
