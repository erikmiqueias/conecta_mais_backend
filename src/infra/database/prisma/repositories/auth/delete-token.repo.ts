import { prisma } from "@infra/database/lib/db.js";
import { IDeleteTokenRepository } from "@modules/auth/repositories/delete-token.interface.js";

export class DeleteTokenRepository implements IDeleteTokenRepository {
  async execute(tokenId: string): Promise<boolean> {
    return !!(await prisma.token.delete({
      where: {
        id: tokenId,
      },
    }));
  }
}
