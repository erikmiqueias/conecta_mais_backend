import { prisma } from "@infra/database/lib/db.js";
import { IUpdateUserAvatarRepository } from "@modules/user/repositories/update-user-avatar.interface.js";

export class UpdateUserAvatarRepository implements IUpdateUserAvatarRepository {
  async execute(userId: string, avatarUrl: string): Promise<void> {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl,
      },
    });
  }
}
