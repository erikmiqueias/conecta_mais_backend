import { prisma } from "@infra/database/lib/db.js";
import { OutputGetUserByIdDTO } from "@modules/user/dtos/user.dto.js";
import { IGetUserByIdRepository } from "@modules/user/repositories/get-user-by-id.interface.js";

export class GetUserByIdRepository implements IGetUserByIdRepository {
  async execute(userId: string): Promise<OutputGetUserByIdDTO | null> {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    return user;
  }
}
