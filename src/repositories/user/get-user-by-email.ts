import { IGetUserByEmailRepository } from "../../interfaces/user/repositories/get-user-by-email.js";
import { prisma } from "../../lib/db.js";

export class GetUserByEmailRepository implements IGetUserByEmailRepository {
  async execute(email: string): Promise<unknown> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }
}
