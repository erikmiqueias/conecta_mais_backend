import { prisma } from "@infra/database/lib/db.js";
import { IGetUserByVerificationTokenRepository } from "@modules/user/repositories/get-user-by-verification-token.interface.js";

export class GetUserByVerificationTokenRepository implements IGetUserByVerificationTokenRepository {
  async execute(
    token: string,
  ): Promise<{ id: string; verificationTokenExpiry: Date | null } | null> {
    return await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
      select: {
        id: true,
        verificationTokenExpiry: true,
      },
    });
  }
}
