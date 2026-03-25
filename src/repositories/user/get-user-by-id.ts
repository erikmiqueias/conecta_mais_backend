import { OutputGetUserByIdDTO } from "../../dtos/user.dto.js";
import { IGetUserByIdRepository } from "../../interfaces/user/repositories/get-user-by-id.js";
import { prisma } from "../../lib/db.js";

export class GetUserByIdRepository implements IGetUserByIdRepository {
  async execute(userId: string): Promise<OutputGetUserByIdDTO | null> {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    return user;
  }
}
