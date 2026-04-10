import { prisma } from "@infra/database/lib/db.js";
import { OutputGetUserByEmailDTO } from "@modules/user/dtos/user.dto.js";
import { IGetUserByEmailRepository } from "@modules/user/repositories/get-user-by-email.interface.js";

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
