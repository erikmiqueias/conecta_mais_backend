import { Token } from "@generated/prisma/client.js";
import { prisma } from "@infra/database/lib/db.js";
import { IFindByTokenRepository } from "@modules/auth/repositories/find-by-token.interface.js";

export class FindByTokenRepository implements IFindByTokenRepository {
  async execute(token: string): Promise<Token | null> {
    const tokenExists = await prisma.token.findFirst({
      where: {
        code: token,
      },
    });

    return tokenExists;
  }
}
