import { prisma } from "@shared/lib/db.js";

import { OutputGetUserByEmailDTO } from "../dtos/user.dto.js";
import { IGetUserByEmailRepository } from "./interfaces/get-user-by-email.interface.js";

export class GetUserByEmailRepository implements IGetUserByEmailRepository {
  async execute(email: string): Promise<OutputGetUserByEmailDTO | null> {
    const user = await prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    return user;
  }
}
