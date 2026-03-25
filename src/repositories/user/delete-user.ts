import { IDeleteUserRepository } from "../../interfaces/user/repositories/delete-user.js";
import { prisma } from "../../lib/db.js";

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
