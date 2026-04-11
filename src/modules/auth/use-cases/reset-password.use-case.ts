import { IUpdatePasswordRepository } from "@modules/user/repositories/update-password.interface.js";
import { InvalidTokenError } from "@shared/errors/errors.js";
import bcrypt from "bcryptjs";
import { isAfter } from "date-fns";

import { IDeleteTokenRepository } from "../repositories/delete-token.interface.js";
import { IFindByTokenRepository } from "../repositories/find-by-token.interface.js";

export class ResetPasswordUseCase {
  constructor(
    private readonly findByCodeRepository: IFindByTokenRepository,
    private readonly deleteTokenRepository: IDeleteTokenRepository,
    private readonly updatePasswordRepository: IUpdatePasswordRepository,
  ) {}
  async execute(tokenCode: string, newPassword: string): Promise<void> {
    const token = await this.findByCodeRepository.execute(tokenCode);

    if (!token) throw new InvalidTokenError("Token not found");

    if (isAfter(new Date(), token.expiresAt)) {
      await this.deleteTokenRepository.execute(token.id);
      throw new InvalidTokenError("Token expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.updatePasswordRepository.execute(token.userId, hashedPassword);

    await this.deleteTokenRepository.execute(token.id);
  }
}
