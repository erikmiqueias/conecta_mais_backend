import { prisma } from "@shared/lib/db.js";

import { IDeleteUserRepository } from "./interfaces/delete-user.interface.js";

export class DeleteUserRepository implements IDeleteUserRepository {
  async execute(userId: string): Promise<boolean> {
    const deleteUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return !!deleteUser;
  }
}
