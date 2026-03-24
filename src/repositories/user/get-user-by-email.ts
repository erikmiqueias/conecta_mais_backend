import { prisma } from "../../lib/db.js";

export class GetUserByEmailRepository {
  async execute(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }
}
