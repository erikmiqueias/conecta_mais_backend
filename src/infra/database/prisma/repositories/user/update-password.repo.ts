import { prisma } from "@infra/database/lib/db.js";
import { IUpdatePasswordRepository } from "@modules/user/repositories/update-password.interface.js";

export class UpdatePasswordRepository implements IUpdatePasswordRepository {
  async execute(userIdToken: string, newPassword: string): Promise<boolean> {
    return !!(await prisma.user.update({
      where: {
        id: userIdToken,
      },
      data: {
        password: newPassword,
      },
    }));
  }
}
