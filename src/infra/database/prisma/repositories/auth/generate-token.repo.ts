import { prisma } from "@infra/database/lib/db.js";
import { IGenerateForgotPasswordTokenRepository } from "@modules/auth/repositories/generate-token.interface.js";

export class GenerateForgotPasswordTokenRepository implements IGenerateForgotPasswordTokenRepository {
  async execute(userId: string, expiresAt: Date): Promise<{ code: string }> {
    const token = prisma.token.create({
      data: {
        userId,
        expiresAt,
      },
    });

    return token;
  }
}
