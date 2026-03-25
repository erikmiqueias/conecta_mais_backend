import { OutputGetUserByEmailDTO } from "../../dtos/user.dto.js";
import { IGetUserByEmailRepository } from "../../interfaces/user/repositories/get-user-by-email.js";
import { prisma } from "../../lib/db.js";

export class GetUserByEmailRepository implements IGetUserByEmailRepository {
  async execute(email: string): Promise<OutputGetUserByEmailDTO | null> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }
}
