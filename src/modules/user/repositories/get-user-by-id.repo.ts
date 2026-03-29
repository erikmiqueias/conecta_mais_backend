import { prisma } from "@shared/lib/db.js";

import { OutputGetUserByIdDTO } from "../dtos/user.dto.js";
import { IGetUserByIdRepository } from "./interfaces/get-user-by-id.interface.js";

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
