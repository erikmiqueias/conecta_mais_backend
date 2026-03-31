import { prisma } from "@shared/lib/db.js";

import { IDeleteUserRepository } from "./interfaces/delete-user.interface.js";

export class DeleteUserRepository implements IDeleteUserRepository {
  async execute(userId: string): Promise<boolean> {
    const deleteUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return !!deleteUser;
  }
}
